// src/modules/reports/services/admin-report.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  RevenueQueryDto,
  StudentReportQueryDto,
  ClassReportQueryDto,
} from '../dto/report-query.dto.js';

export class AdminReportService {
  // =============================================
  // 1. TỔNG QUAN HỆ THỐNG (DASHBOARD)
  // =============================================

  async getDashboard() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // 1. Tổng số học viên
    const totalStudents = await prisma.taikhoan.count({
      where: {
        VaiTro: 'HOC_VIEN',
        IsDeleted: false,
      },
    });

    // 2. Tổng số giáo viên
    const totalTeachers = await prisma.taikhoan.count({
      where: {
        VaiTro: 'GIAO_VIEN',
        IsDeleted: false,
      },
    });

    // 3. Tổng số khóa học
    const totalCourses = await prisma.khoahoc.count({
      where: {
        IsDeleted: false,
      },
    });

    // 4. Tổng số lớp học
    const totalClasses = await prisma.lophoc.count({
      where: {
        TrangThai: {
          not: 'DA_HUY',
        },
      },
    });

    // 5. Lớp đang học
    const activeClasses = await prisma.lophoc.count({
      where: {
        TrangThai: 'DANG_HOC',
      },
    });

    // 6. Lớp sắp khai giảng
    const upcomingClasses = await prisma.lophoc.count({
      where: {
        TrangThai: 'SAP_KHAI_GIANG',
      },
    });

    // 7. Tổng doanh thu (học phí đã đóng của học viên đã duyệt)
    const revenueResult = await prisma.hocvien_lophoc.aggregate({
      where: {
        TrangThai: 'DA_DUYET',
        DongHocPhi: true,
      },
      _sum: {
        HocPhi: true,
      },
    });
    const totalRevenue = revenueResult._sum.HocPhi || 0;

    // 8. Học viên mới trong tháng
    const newStudentsThisMonth = await prisma.taikhoan.count({
      where: {
        VaiTro: 'HOC_VIEN',
        CreatedAt: {
          gte: firstDayOfMonth,
        },
        IsDeleted: false,
      },
    });

    // 9. Học viên mới tháng trước (tính tăng trưởng)
    const newStudentsLastMonth = await prisma.taikhoan.count({
      where: {
        VaiTro: 'HOC_VIEN',
        CreatedAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfMonth,
        },
        IsDeleted: false,
      },
    });

    const studentGrowth =
      newStudentsLastMonth > 0
        ? ((newStudentsThisMonth - newStudentsLastMonth) / newStudentsLastMonth) * 100
        : newStudentsThisMonth > 0
        ? 100
        : 0;

    // 10. Học viên đăng ký theo tháng (6 tháng gần nhất)
    const monthlyStudents = await this.getMonthlyStudents(6);

    // 11. Doanh thu theo tháng (6 tháng gần nhất)
    const monthlyRevenue = await this.getMonthlyRevenue(6);

    // 12. Phân bố học viên theo trình độ
    const levelDistribution = await this.getLevelDistribution();

    // 13. Phân bố lớp theo trạng thái
    const classStatusDistribution = await prisma.lophoc.groupBy({
      by: ['TrangThai'],
      _count: {
        LopHocID: true,
      },
      where: {
        TrangThai: {
          not: 'DA_HUY',
        },
      },
    });

    return {
      total_students: totalStudents,
      total_teachers: totalTeachers,
      total_courses: totalCourses,
      total_classes: totalClasses,
      active_classes: activeClasses,
      upcoming_classes: upcomingClasses,
      total_revenue: totalRevenue,
      new_students_this_month: newStudentsThisMonth,
      student_growth: Math.round(studentGrowth * 100) / 100,
      monthly_students: monthlyStudents,
      monthly_revenue: monthlyRevenue,
      level_distribution: levelDistribution,
      class_status_distribution: classStatusDistribution.map((item) => ({
        status: item.TrangThai,
        count: item._count.LopHocID,
      })),
    };
  }

  // =============================================
  // 2. DOANH THU THEO THỜI GIAN
  // =============================================

  async getRevenue(query: RevenueQueryDto) {
    const { period, year, month, quarter } = query;

    let startDate: Date;
    let endDate: Date;
    let groupBy: string;

    if (period === 'month') {
      const m = month || new Date().getMonth() + 1;
      startDate = new Date(year, m - 1, 1);
      endDate = new Date(year, m, 0);
      groupBy = 'week';
    } else if (period === 'quarter') {
      const q = quarter || 1;
      startDate = new Date(year, (q - 1) * 3, 1);
      endDate = new Date(year, q * 3, 0);
      groupBy = 'month';
    } else {
      startDate = new Date(year, 0, 1);
      endDate = new Date(year, 11, 31);
      groupBy = 'month';
    }

    // Lấy doanh thu theo khoảng thời gian
    const revenueData = await prisma.hocvien_lophoc.findMany({
      where: {
        TrangThai: 'DA_DUYET',
        DongHocPhi: true,
        UpdatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        HocPhi: true,
        UpdatedAt: true,
        HocVienID: true,
        LopHocID: true,
      },
    });

    // Tính tổng doanh thu
    const totalRevenue = revenueData.reduce((sum, item) => sum + (Number(item.HocPhi) || 0), 0);
    const studentCount = new Set(revenueData.map((item) => item.HocVienID)).size;
    const classCount = new Set(revenueData.map((item) => item.LopHocID)).size;

    // Chi tiết theo tuần/tháng
    const detail = this.groupRevenueByPeriod(revenueData, period, startDate, endDate);

    return {
      period: `${year}-${String(month || quarter || 1).padStart(2, '0')}`,
      total_revenue: totalRevenue,
      student_count: studentCount,
      class_count: classCount,
      detail,
    };
  }

  // =============================================
  // 3. THỐNG KÊ HỌC VIÊN
  // =============================================

  async getStudentReport(query: StudentReportQueryDto) {
    const {
      trinhDo,
      status = 'ALL',
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      search,
    } = query;

    // Xây dựng điều kiện where cho tài khoản
    const where: any = {
      VaiTro: 'HOC_VIEN',
      IsDeleted: false,
    };

    if (status !== 'ALL') {
      where.TrangThai = status;
    }

    if (search) {
      where.OR = [
        { Email: { contains: search,  } },
        { HoVaTen: { contains: search,  } },
      ];
    }

    if (fromDate || toDate) {
      where.CreatedAt = {};
      if (fromDate) where.CreatedAt.gte = new Date(fromDate);
      if (toDate) where.CreatedAt.lte = new Date(toDate);
    }

    // Lấy danh sách học viên
    const students = await prisma.taikhoan.findMany({
      where,
      select: {
        TaiKhoanID: true,
        Email: true,
        HoVaTen: true,
        NgaySinh: true,
        GioiTinh: true,
        TrangThai: true,
        CreatedAt: true,
        hocvien: {
          select: {
            HocVienID: true,
            MaHocVien: true,
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    const total = await prisma.taikhoan.count({ where });

    // Lấy thông tin trình độ của từng học viên
    const studentIds = students.map((s) => s.TaiKhoanID);

    let levelMap: Record<number, string> = {};
    if (studentIds.length > 0) {
      const enrollments = await prisma.hocvien_lophoc.findMany({
        where: {
          HocVienID: { in: studentIds },
          TrangThai: 'DA_DUYET',
        },
        include: {
          lophoc: {
            include: {
              khoahoc: {
                include: {
                  trinhdo: true,
                },
              },
            },
          },
        },
      });

      // Lấy trình độ mới nhất của mỗi học viên
      for (const enrollment of enrollments) {
        const level = enrollment.lophoc?.khoahoc?.trinhdo?.TenDanhMuc;
        if (level && !levelMap[enrollment.HocVienID]) {
          levelMap[enrollment.HocVienID] = level;
        }
      }
    }

    // Format dữ liệu
    const formattedData = students.map((student) => ({
      id: student.TaiKhoanID,
      ma_hoc_vien: student.hocvien?.MaHocVien || null,
      ho_va_ten: student.HoVaTen,
      email: student.Email,
      ngay_sinh: student.NgaySinh,
      gioi_tinh: student.GioiTinh,
      trang_thai: student.TrangThai,
      trinh_do: levelMap[student.TaiKhoanID] || 'Chưa xác định',
      created_at: student.CreatedAt,
    }));

    return {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      data: formattedData,
    };
  }

  // =============================================
  // 4. THỐNG KÊ LỚP HỌC
  // =============================================

  async getClassReport(query: ClassReportQueryDto) {
    const {
      status = 'ALL',
      khoaHoc,
      giaoVien,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      search,
    } = query;

    // Xây dựng điều kiện where
    const where: any = {};

    if (status !== 'ALL') {
      where.TrangThai = status;
    } else {
      where.TrangThai = { not: 'DA_HUY' };
    }

    if (khoaHoc) {
      where.KhoaHocID = khoaHoc;
    }

    if (giaoVien) {
      where.GiaoVienID = giaoVien;
    }

    if (search) {
      where.TenLopHoc = { contains: search,  };
    }

    if (fromDate || toDate) {
      where.CreatedAt = {};
      if (fromDate) where.CreatedAt.gte = new Date(fromDate);
      if (toDate) where.CreatedAt.lte = new Date(toDate);
    }

    // Lấy danh sách lớp học
    const classes = await prisma.lophoc.findMany({
      where,
      include: {
        khoahoc: {
          select: {
            KhoaHocID: true,
            TenKhoaHoc: true,
          },
        },
        giaovien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
              },
            },
          },
        },
        dotKhaiGiang: {
          select: {
            MaDot: true,
            TenDot: true,
          },
        },
        _count: {
          select: {
            hocvien_lophoc: {
              where: {
                TrangThai: 'DA_DUYET',
              },
            },
          },
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    const total = await prisma.lophoc.count({ where });

    // Tính thêm thông tin
    const formattedData = classes.map((cls) => ({
      id: cls.LopHocID,
      ten_lop_hoc: cls.TenLopHoc,
      khoa_hoc: cls.khoahoc?.TenKhoaHoc || null,
      giao_vien: cls.giaovien?.taikhoan?.HoVaTen || null,
      dot_khai_giang: cls.dotKhaiGiang ,
      hinh_thuc_hoc: cls.HinhThucHoc,
      si_so_toi_da: cls.SiSoToiDa,
      si_so_hien_tai: cls._count.hocvien_lophoc,
      ti_le_lap_day:
        cls.SiSoToiDa && cls.SiSoToiDa > 0
          ? Math.round((cls._count.hocvien_lophoc / cls.SiSoToiDa) * 100)
          : 0,
      ngay_bat_dau: cls.NgayBatDau,
      ngay_ket_thuc: cls.NgayKetThuc,
      trang_thai: cls.TrangThai,
      created_at: cls.CreatedAt,
    }));

    return {
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
      data: formattedData,
    };
  }

  // =============================================
  // PRIVATE HELPERS
  // =============================================

  private async getMonthlyStudents(months: number) {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const count = await prisma.taikhoan.count({
        where: {
          VaiTro: 'HOC_VIEN',
          CreatedAt: {
            gte: date,
            lt: nextDate,
          },
          IsDeleted: false,
        },
      });

      result.push({
        month: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
        count,
      });
    }

    return result;
  }

  private async getMonthlyRevenue(months: number) {
    const result = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      const revenue = await prisma.hocvien_lophoc.aggregate({
        where: {
          TrangThai: 'DA_DUYET',
          DongHocPhi: true,
          UpdatedAt: {
            gte: date,
            lt: nextDate,
          },
        },
        _sum: {
          HocPhi: true,
        },
      });

      result.push({
        month: `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`,
        revenue: revenue._sum.HocPhi || 0,
      });
    }

    return result;
  }

  private async getLevelDistribution() {
    const enrollments = await prisma.hocvien_lophoc.findMany({
      where: {
        TrangThai: 'DA_DUYET',
      },
      include: {
        lophoc: {
          include: {
            khoahoc: {
              include: {
                trinhdo: true,
              },
            },
          },
        },
      },
    });

    const levelMap: Record<string, Set<number>> = {};

    for (const enrollment of enrollments) {
      const level = enrollment.lophoc?.khoahoc?.trinhdo?.TenDanhMuc || 'Chưa xác định';
      if (!levelMap[level]) {
        levelMap[level] = new Set();
      }
      levelMap[level].add(enrollment.HocVienID);
    }

    return Object.entries(levelMap).map(([level, students]) => ({
      level,
      count: students.size,
    }));
  }

  private groupRevenueByPeriod(
    data: any[],
    period: string,
    startDate: Date,
    endDate: Date
  ) {
    const result = [];
    let currentDate = new Date(startDate);

    if (period === 'month') {
      // Group by week
      let week = 1;
      while (currentDate <= endDate) {
        const weekEnd = new Date(currentDate);
        weekEnd.setDate(weekEnd.getDate() + 6);

        const weekData = data.filter((item) => {
          const date = new Date(item.UpdatedAt);
          return date >= currentDate && date <= weekEnd;
        });

        result.push({
          week,
          revenue: weekData.reduce((sum, item) => sum + (item.HocPhi || 0), 0),
          students: new Set(weekData.map((item) => item.HocVienID)).size,
        });

        currentDate.setDate(currentDate.getDate() + 7);
        week++;
      }
    } else {
      // Group by month
      while (currentDate <= endDate) {
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

        const monthData = data.filter((item) => {
          const date = new Date(item.UpdatedAt);
          return date >= currentDate && date <= monthEnd;
        });

        result.push({
          week: currentDate.getMonth() + 1,
          revenue: monthData.reduce((sum, item) => sum + (item.HocPhi || 0), 0),
          students: new Set(monthData.map((item) => item.HocVienID)).size,
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }

    return result;
  }
}