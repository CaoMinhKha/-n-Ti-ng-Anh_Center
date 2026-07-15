// src/modules/reports/services/student-report.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';

export class StudentReportService {
  // =============================================
  // 1. TỔNG QUAN HỌC TẬP CỦA TÔI
  // =============================================

  async getDashboard(hocVienId: number) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Lấy danh sách lớp đã đăng ký (đã duyệt)
    const enrollments = await prisma.hocvien_lophoc.findMany({
      where: {
        HocVienID: hocVienId,
        TrangThai: 'DA_DUYET',
      },
      include: {
        lophoc: {
          include: {
            khoahoc: true,
            giaovien: {
              include: {
                taikhoan: true,
              },
            },
          },
        },
      },
    });

    const lopHocIds = enrollments.map((e) => e.LopHocID);

    // Lấy danh sách tiến độ học tập
    const progressList = await prisma.tiendohoctap.findMany({
      where: {
        HocVienID: hocVienId,
        LopHocID: { in: lopHocIds },
      },
    });

    // Tính tiến độ tổng
    const totalLessons = progressList.length;
    const completedLessons = progressList.filter((p) => p.TrangThai === 'HOAN_THANH').length;
    const progressPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    // Lấy điểm trung bình
    const ketQuas = await prisma.ketquahoctap.findMany({
      where: {
        HocVienID: hocVienId,
        LopHocID: { in: lopHocIds },
      },
    });

    const avgScore =
      ketQuas.length > 0
        ? Math.round(
            ketQuas.reduce((sum, k) => {
              const diem = k.TongDiem ? Number(k.TongDiem) : 0;
              return sum + diem;
            }, 0) / ketQuas.length * 100
          ) / 100
        : 0;

    // Lấy xếp loại mới nhất
    const latestResult = ketQuas
      .filter((k) => k.NgayCapNhat !== null)
      .sort((a, b) => {
        const dateA = a.NgayCapNhat ? new Date(a.NgayCapNhat).getTime() : 0;
        const dateB = b.NgayCapNhat ? new Date(b.NgayCapNhat).getTime() : 0;
        return dateB - dateA;
      })[0] || null;

    // Lấy điểm danh
    const diemDanhs = await prisma.hocvien_diemdanh.findMany({
      where: {
        HocVienID: hocVienId,
        buoihoc: {
          LopHocID: { in: lopHocIds },
        },
      },
    });

    const totalBuoi = diemDanhs.length;
    const coMat = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length;
    const attendancePercent =
      totalBuoi > 0 ? Math.round((coMat / totalBuoi) * 100) : 0;

    // Danh sách lớp đang học
    const activeClasses = enrollments
      .filter((e) => e.lophoc?.TrangThai === 'DANG_HOC' || e.lophoc?.TrangThai === 'SAP_KHAI_GIANG')
      .map((e) => {
        const classProgress = progressList.filter((p) => p.LopHocID === e.LopHocID);
        const classCompleted = classProgress.filter((p) => p.TrangThai === 'HOAN_THANH').length;
        const classTotal = classProgress.length;

        const classKetQuas = ketQuas.filter((k) => k.LopHocID === e.LopHocID);
        const classAvg =
          classKetQuas.length > 0
            ? Math.round(
                classKetQuas.reduce((sum, k) => {
                  const diem = k.TongDiem ? Number(k.TongDiem) : 0;
                  return sum + diem;
                }, 0) / classKetQuas.length * 100
              ) / 100
            : 0;

        return {
          id: e.LopHocID,
          ten_lop_hoc: e.lophoc?.TenLopHoc || 'Chưa xác định',
          khoa_hoc: e.lophoc?.khoahoc?.TenKhoaHoc || null,
          giao_vien: e.lophoc?.giaovien?.taikhoan?.HoVaTen || null,
          progress: classTotal > 0 ? Math.round((classCompleted / classTotal) * 100) : 0,
          avg_score: classAvg,
          trang_thai: e.lophoc?.TrangThai || 'UNKNOWN',
        };
      });

    return {
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percent: progressPercent,
      avg_score: avgScore,
      current_rank: latestResult?.XepLoai || 'CHUA_XEP_LOAI',
      total_buoi: totalBuoi,
      co_mat: coMat,
      attendance_percent: attendancePercent,
      classes: activeClasses,
    };
  }

  // =============================================
  // 2. KẾT QUẢ HỌC TẬP CỦA TÔI
  // =============================================

  async getResults(hocVienId: number, lopHocId?: number) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Xác định lớp học cần lấy
    let lopHocIds: number[] = [];
    if (lopHocId) {
      // Kiểm tra học viên có trong lớp này không
      const enrollment = await prisma.hocvien_lophoc.findFirst({
        where: {
          HocVienID: hocVienId,
          LopHocID: lopHocId,
          TrangThai: 'DA_DUYET',
        },
      });

      if (!enrollment) {
        throw new AppError('Bạn không tham gia lớp học này', 404);
      }
      lopHocIds = [lopHocId];
    } else {
      // Lấy tất cả lớp đã đăng ký
      const enrollments = await prisma.hocvien_lophoc.findMany({
        where: {
          HocVienID: hocVienId,
          TrangThai: 'DA_DUYET',
        },
        select: { LopHocID: true },
      });
      lopHocIds = enrollments.map((e) => e.LopHocID);
    }

    if (lopHocIds.length === 0) {
      return {
        class_info: null,
        scores: null,
        progress: [],
        class_avg_score: null,
        class_rank: null,
      };
    }

    // Lấy kết quả học tập
    const ketQua = await prisma.ketquahoctap.findFirst({
      where: {
        HocVienID: hocVienId,
        LopHocID: { in: lopHocIds },
      },
      include: {
        lophoc: {
          include: {
            khoahoc: true,
            giaovien: {
              include: {
                taikhoan: true,
              },
            },
          },
        },
      },
      orderBy: {
        NgayCapNhat: 'desc',
      },
    });

    // Lấy tiến độ học tập
    const progress = await prisma.tiendohoctap.findMany({
      where: {
        HocVienID: hocVienId,
        LopHocID: { in: lopHocIds },
      },
      include: {
        phanbaihoc: {
          select: {
            PhanBaiHocID: true,
            TenPhanBaiHoc: true,
          },
        },
      },
      orderBy: {
        CreatedAt: 'asc',
      },
    });

    // Lấy điểm trung bình lớp và xếp hạng (chỉ khi có lopHocId)
    let classAvgScore = null;
    let classRank = null;

    if (lopHocId && ketQua) {
      const allResults = await prisma.ketquahoctap.findMany({
        where: {
          LopHocID: lopHocId,
        },
        select: {
          HocVienID: true,
          TongDiem: true,
        },
        orderBy: {
          TongDiem: 'desc',
        },
      });

      const scores = allResults.map((r) => (r.TongDiem ? Number(r.TongDiem) : 0));
      classAvgScore =
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 100) / 100
          : 0;

      const myScore = ketQua.TongDiem ? Number(ketQua.TongDiem) : 0;
      const higherScores = scores.filter((s) => s > myScore);
      classRank = higherScores.length + 1;
    }

    return {
      class_info: ketQua?.lophoc
        ? {
            id: ketQua.lophoc.LopHocID,
            ten_lop_hoc: ketQua.lophoc.TenLopHoc,
            khoa_hoc: ketQua.lophoc.khoahoc?.TenKhoaHoc || null,
            giao_vien: ketQua.lophoc.giaovien?.taikhoan?.HoVaTen || null,
            ngay_bat_dau: ketQua.lophoc.NgayBatDau,
            ngay_ket_thuc: ketQua.lophoc.NgayKetThuc,
          }
        : null,
      scores: ketQua
        ? {
            diem_chuyen_can: ketQua.DiemChuyenCan ? Number(ketQua.DiemChuyenCan) : 0,
            diem_bai_tap: ketQua.DiemBaiTap ? Number(ketQua.DiemBaiTap) : 0,
            diem_kiem_tra: ketQua.DiemKiemTra ? Number(ketQua.DiemKiemTra) : 0,
            tong_diem: ketQua.TongDiem ? Number(ketQua.TongDiem) : 0,
            xep_loai: ketQua.XepLoai || 'KHONG_DAT',
          }
        : null,
      progress: progress.map((p) => ({
        phan_bai_hoc_id: p.PhanBaiHocID,
        ten_phan_bai_hoc: p.phanbaihoc?.TenPhanBaiHoc || 'Chưa xác định',
        tong_so_cau_hoi: p.TongSoCauHoi || 0,
        tong_so_cau_hoi_dung: p.TongSoCauHoiDung || 0,
        ti_le_hoan_thanh:
          p.TongSoCauHoi && p.TongSoCauHoi > 0
            ? Math.round((p.TongSoCauHoiDung?? 0 / p.TongSoCauHoi) * 100)
            : 0,
        trang_thai: p.TrangThai || 'CHUA_BAT_DAU',
      })),
      class_avg_score: classAvgScore,
      class_rank: classRank,
    };
  }

  // =============================================
  // 3. LỊCH SỬ ĐIỂM DANH
  // =============================================

  async getAttendanceHistory(hocVienId: number, fromDate?: string, toDate?: string) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Lấy danh sách lớp của học viên
    const enrollments = await prisma.hocvien_lophoc.findMany({
      where: {
        HocVienID: hocVienId,
        TrangThai: 'DA_DUYET',
      },
      select: { LopHocID: true },
    });

    const lopHocIds = enrollments.map((e) => e.LopHocID);

    if (lopHocIds.length === 0) {
      return {
        total_buoi: 0,
        co_mat: 0,
        vang_co_phep: 0,
        vang_khong_phep: 0,
        di_muon: 0,
        attendance_percent: 0,
        history: [],
      };
    }

    // Lấy lịch sử điểm danh
    const where: any = {
      HocVienID: hocVienId,
      buoihoc: {
        LopHocID: { in: lopHocIds },
      },
    };

    if (fromDate || toDate) {
      where.buoihoc.NgayHoc = {};
      if (fromDate) where.buoihoc.NgayHoc.gte = new Date(fromDate);
      if (toDate) where.buoihoc.NgayHoc.lte = new Date(toDate);
    }

    const diemDanhs = await prisma.hocvien_diemdanh.findMany({
      where,
      include: {
        buoihoc: {
          include: {
            lophoc: {
              select: {
                TenLopHoc: true,
              },
            },
            cahoc: {
              select: {
                TenCa: true,
              },
            },
          },
        },
      },
      orderBy: {
        buoihoc: {
          NgayHoc: 'desc',
        },
      },
    });

    const totalBuoi = diemDanhs.length;
    const coMat = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'CO_MAT').length;
    const vangCoPhep = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'VANG_CO_PHEP').length;
    const vangKhongPhep = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'VANG_KHONG_PHEP').length;
    const diMuon = diemDanhs.filter((d) => d.TrangThaiDiemDanh === 'DI_MUON').length;

    return {
      total_buoi: totalBuoi,
      co_mat: coMat,
      vang_co_phep: vangCoPhep,
      vang_khong_phep: vangKhongPhep,
      di_muon: diMuon,
      attendance_percent: totalBuoi > 0 ? Math.round((coMat / totalBuoi) * 100) : 0,
      history: diemDanhs.map((d) => ({
        date: d.buoihoc?.NgayHoc.toISOString().split('T')[0] || '',
        trang_thai: d.TrangThaiDiemDanh || '',
        ghi_chu: d.GhiChu || null,
        lop_hoc: d.buoihoc?.lophoc?.TenLopHoc || '',
        ca_hoc: d.buoihoc?.cahoc?.TenCa || '',
      })),
    };
  }
}