// src/modules/reports/services/teacher-report.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';

export class TeacherReportService {
  // =============================================
  // 1. TỔNG QUAN LỚP HỌC CỦA TÔI
  // =============================================

  async getDashboard(giaoVienId: number) {
    // Kiểm tra giáo viên tồn tại
    const giaoVien = await prisma.giaovien.findUnique({
      where: { GiaoVienID: giaoVienId },
    });

    if (!giaoVien) {
      throw new AppError('Giáo viên không tồn tại', 404);
    }

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Lấy danh sách lớp của giáo viên
    const classes = await prisma.lophoc.findMany({
      where: {
        GiaoVienID: giaoVienId,
        TrangThai: {
          not: 'DA_HUY',
        },
      },
      include: {
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
    });

    const totalClasses = classes.length;
    const activeClasses = classes.filter((c) => c.TrangThai === 'DANG_HOC').length;

    // Tính tổng học viên
    let totalStudents = 0;
    const classData = [];

    for (const cls of classes) {
      const siSo = cls._count.hocvien_lophoc;
      totalStudents += siSo;

      // Tỉ lệ lấp đầy
      const tiLeLapDay =
        cls.SiSoToiDa && cls.SiSoToiDa > 0
          ? Math.round((siSo / cls.SiSoToiDa) * 100)
          : 0;

      // Tỉ lệ điểm danh
      const attendanceRate = await this.getClassAttendanceRate(cls.LopHocID);

      classData.push({
        id: cls.LopHocID,
        ten_lop_hoc: cls.TenLopHoc,
        si_so: siSo,
        si_so_toi_da: cls.SiSoToiDa || 0,
        ti_le_lap_day: tiLeLapDay,
        ti_le_diem_danh: Math.round(attendanceRate * 100) / 100,
        trang_thai: cls.TrangThai,
      });
    }

    // Tỉ lệ điểm danh trung bình
    const avgAttendance =
      classData.length > 0
        ? classData.reduce((sum, c) => sum + c.ti_le_diem_danh, 0) / classData.length
        : 0;

    // Học viên mới trong tháng
    const newStudentsThisMonth = await prisma.hocvien_lophoc.count({
      where: {
        lophoc: {
          GiaoVienID: giaoVienId,
        },
        NgayDangKy: {
          gte: firstDayOfMonth,
        },
        TrangThai: 'DA_DUYET',
      },
    });

    return {
      total_classes: totalClasses,
      active_classes: activeClasses,
      total_students: totalStudents,
      avg_attendance: Math.round(avgAttendance * 100) / 100,
      classes: classData,
      new_students_this_month: newStudentsThisMonth,
    };
  }

  // =============================================
  // 2. KẾT QUẢ HỌC TẬP CỦA LỚP
  // =============================================


// src/modules/reports/services/teacher-report.service.ts (Phần getClassResults)

async getClassResults(giaoVienId: number, lopHocId: number, page: number, limit: number) {
  // Kiểm tra giáo viên có dạy lớp này không
  const lopHoc = await prisma.lophoc.findFirst({
    where: {
      LopHocID: lopHocId,
      GiaoVienID: giaoVienId,
    },
    include: {
      khoahoc: true,
      giaovien: {
        include: {
          taikhoan: true,
        },
      },
    },
  });

  if (!lopHoc) {
    throw new AppError('Không tìm thấy lớp học hoặc bạn không có quyền', 404);
  }

  // Lấy danh sách học viên đã duyệt
  const where: any = {
    LopHocID: lopHocId,
    TrangThai: 'DA_DUYET',
  };

  const total = await prisma.hocvien_lophoc.count({ where });

  const enrollments = await prisma.hocvien_lophoc.findMany({
    where,
    include: {
      hocvien: {
        include: {
          taikhoan: true,
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  //  Lấy kết quả học tập riêng (không include trong enrollments)
  const hocVienIds = enrollments.map((e) => e.HocVienID);

  let ketQuaMap: Record<number, any> = {};
  if (hocVienIds.length > 0) {
    const ketQuas = await prisma.ketquahoctap.findMany({
      where: {
        HocVienID: { in: hocVienIds },
        LopHocID: lopHocId,
      },
    });

    ketQuaMap = {};
    for (const kq of ketQuas) {
      ketQuaMap[kq.HocVienID] = kq;
    }
  }

  // Format dữ liệu
  const students = enrollments.map((enrollment) => {
    const ketQua = ketQuaMap[enrollment.HocVienID];
    return {
      id: enrollment.HocVienID,
      ma_hoc_vien: enrollment.hocvien?.MaHocVien || null,
      ho_va_ten: enrollment.hocvien?.taikhoan?.HoVaTen || 'Chưa xác định',
      email: enrollment.hocvien?.taikhoan?.Email || null,
      diem_chuyen_can: ketQua?.DiemChuyenCan || 0,
      diem_bai_tap: ketQua?.DiemBaiTap || 0,
      diem_kiem_tra: ketQua?.DiemKiemTra || 0,
      tong_diem: ketQua?.TongDiem || 0,
      xep_loai: ketQua?.XepLoai || 'KHONG_DAT',
    };
  });

  // Thống kê điểm
  const scores = students.map((s) => s.tong_diem);
  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  // Phân bố xếp loại
  const distribution = await prisma.ketquahoctap.groupBy({
    by: ['XepLoai'],
    _count: {
      XepLoai: true,
    },
    where: {
      LopHocID: lopHocId,
    },
  });

  return {
    class_info: {
      id: lopHoc.LopHocID,
      ten_lop_hoc: lopHoc.TenLopHoc,
      khoa_hoc: lopHoc.khoahoc?.TenKhoaHoc || null,
      giao_vien: lopHoc.giaovien?.taikhoan?.HoVaTen || null,
      si_so: total,
    },
    students,
    stats: {
      avg_score: Math.round(avgScore * 100) / 100,
      max_score: scores.length > 0 ? Math.max(...scores) : 0,
      min_score: scores.length > 0 ? Math.min(...scores) : 0,
      distribution: distribution.map((item) => ({
        xep_loai: item.XepLoai || 'KHONG_DAT',
        count: item._count.XepLoai,
      })),
    },
    page,
    limit,
    total,
    total_pages: Math.ceil(total / limit),
  };
}

  // =============================================
  // 3. THỐNG KÊ ĐIỂM DANH LỚP
  // =============================================

  async getAttendanceReport(giaoVienId: number, lopHocId: number, fromDate?: string, toDate?: string) {
    // Kiểm tra quyền
    const lopHoc = await prisma.lophoc.findFirst({
      where: {
        LopHocID: lopHocId,
        GiaoVienID: giaoVienId,
      },
      include: {
        giaovien: {
          include: {
            taikhoan: true,
          },
        },
      },
    });

    if (!lopHoc) {
      throw new AppError('Không tìm thấy lớp học hoặc bạn không có quyền', 404);
    }

    // Xây dựng điều kiện where cho buổi học
    const buoiWhere: any = {
      LopHocID: lopHocId,
    };

    if (fromDate || toDate) {
      buoiWhere.NgayHoc = {};
      if (fromDate) buoiWhere.NgayHoc.gte = new Date(fromDate);
      if (toDate) buoiWhere.NgayHoc.lte = new Date(toDate);
    }

    // Lấy danh sách buổi học
    const buoiHocs = await prisma.buoihoc.findMany({
      where: buoiWhere,
      orderBy: {
        NgayHoc: 'asc',
      },
    });

    const totalBuoi = buoiHocs.length;

    if (totalBuoi === 0) {
      return {
        class_info: {
          id: lopHoc.LopHocID,
          ten_lop_hoc: lopHoc.TenLopHoc,
          giao_vien: lopHoc.giaovien?.taikhoan?.HoVaTen || null,
        },
        total_buoi: 0,
        total_attendance: 0,
        stats: {
          co_mat: 0,
          vang_co_phep: 0,
          vang_khong_phep: 0,
          di_muon: 0,
        },
        students: [],
        weekly_attendance: [],
      };
    }

    const buoiHocIds = buoiHocs.map((b) => b.BuoiHocID);

    // Lấy danh sách điểm danh
    const diemDanhs = await prisma.hocvien_diemdanh.findMany({
      where: {
        BuoiHocID: {
          in: buoiHocIds,
        },
      },
    });

    // Thống kê trạng thái
    const stats = {
      co_mat: diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length,
      vang_co_phep: diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'VANG_CO_PHEP').length,
      vang_khong_phep: diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'VANG_KHONG_PHEP').length,
      di_muon: diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'DI_MUON').length,
    };

    // Lấy danh sách học viên của lớp
    const hocViens = await prisma.hocvien_lophoc.findMany({
      where: {
        LopHocID: lopHocId,
        TrangThai: 'DA_DUYET',
      },
      include: {
        hocvien: {
          include: {
            taikhoan: true,
          },
        },
      },
    });

    // Tính tỉ lệ điểm danh của từng học viên
    const studentAttendance = hocViens.map((hv) => {
      const diemDanhCuaHV = diemDanhs.filter((d) => d.HocVienID === hv.HocVienID);
      const coMat = diemDanhCuaHV.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length;
      const vang = diemDanhCuaHV.filter(
        (d) => d.TrangThaiDiemDanh === 'VANG_CO_PHEP' || d.TrangThaiDiemDanh === 'VANG_KHONG_PHEP'
      ).length;
      const diMuon = diemDanhCuaHV.filter((d) => d.TrangThaiDiemDanh === 'DI_MUON').length;

      return {
        id: hv.HocVienID,
        ma_hoc_vien: hv.hocvien?.MaHocVien || null,
        ho_va_ten: hv.hocvien?.taikhoan?.HoVaTen || 'Chưa xác định',
        email: hv.hocvien?.taikhoan?.Email || null,
        co_mat: coMat,
        vang: vang,
        di_muon: diMuon,
        ti_le_chuyen_can: totalBuoi > 0 ? Math.round((coMat / totalBuoi) * 100) : 0,
      };
    });

    // Điểm danh theo buổi (cho biểu đồ)
    const weeklyAttendance = buoiHocs.map((buoi) => {
      const diemDanhBuoi = diemDanhs.filter((d) => d.BuoiHocID === buoi.BuoiHocID);
      return {
        date: buoi.NgayHoc.toISOString().split('T')[0],
        co_mat: diemDanhBuoi.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length,
        vang: diemDanhBuoi.filter(
          (d) => d.TrangThaiDiemDanh === 'VANG_CO_PHEP' || d.TrangThaiDiemDanh === 'VANG_KHONG_PHEP'
        ).length,
        di_muon: diemDanhBuoi.filter((d) => d.TrangThaiDiemDanh === 'DI_MUON').length,
      };
    });

    return {
      class_info: {
        id: lopHoc.LopHocID,
        ten_lop_hoc: lopHoc.TenLopHoc,
        giao_vien: lopHoc.giaovien?.taikhoan?.HoVaTen || null,
      },
      total_buoi: totalBuoi,
      total_attendance: diemDanhs.length,
      stats,
      students: studentAttendance,
      weekly_attendance: weeklyAttendance,
    };
  }

  // =============================================
  // PRIVATE HELPERS
  // =============================================

  private async getClassAttendanceRate(lopHocId: number): Promise<number> {
    const buoiHocs = await prisma.buoihoc.findMany({
      where: { LopHocID: lopHocId },
      select: { BuoiHocID: true },
    });

    if (buoiHocs.length === 0) return 0;

    const buoiHocIds = buoiHocs.map((b) => b.BuoiHocID);

    const diemDanhs = await prisma.hocvien_diemdanh.findMany({
      where: {
        BuoiHocID: { in: buoiHocIds },
      },
    });

    const totalSlots = buoiHocs.length * (await this.getStudentCount(lopHocId));
    if (totalSlots === 0) return 0;

    const coMat = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length;
    return (coMat / totalSlots) * 100;
  }

  private async getStudentCount(lopHocId: number): Promise<number> {
    const count = await prisma.hocvien_lophoc.count({
      where: {
        LopHocID: lopHocId,
        TrangThai: 'DA_DUYET',
      },
    });
    return count;
  }
}