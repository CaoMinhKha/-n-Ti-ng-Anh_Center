// src/modules/bailam/services/bailam.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  CreateBaiLamDto,
  UpdateBaiLamDto,
  BaiLamQueryDto,
  CreateBaiLamChiTietDto,
  UpdateBaiLamChiTietDto,
} from '../dto/index.js';

export class BaiLamService {
  // =============================================
  // BÀI LÀM
  // =============================================

  /**
   * Lấy danh sách bài làm (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: BaiLamQueryDto) {
    const {
      page = 1,
      limit = 10,
      baiKiemTra,
      hocVien,
      lopHoc,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (baiKiemTra) {
      where.BaiKiemTraID = baiKiemTra;
    }

    if (hocVien) {
      where.HocVienID = hocVien;
    }

    if (lopHoc) {
      where.LopHocID = lopHoc;
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const total_items = await prisma.bailam.count({ where });
    const total_pages = Math.ceil(total_items / limit);

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      ThoiGianNop: 'ThoiGianNop',
      TongDiem: 'TongDiem',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    const data = await prisma.bailam.findMany({
      where,
      include: {
        baikiemtra: {
          select: {
            BaiKiemTraID: true,
            TenBaiKiemTra: true,
          },
        },
        hocvien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
                Email: true,
              },
            },
          },
        },
        lophoc: {
          select: {
            LopHocID: true,
            TenLopHoc: true,
          },
        },
        _count: {
          select: {
            bailam_chitiet: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      id: item.BaiLamID,
      bai_kiem_tra_id: item.BaiKiemTraID,
      ten_bai_kiem_tra: item.baikiemtra?.TenBaiKiemTra || null,
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      lop_hoc_id: item.LopHocID,
      ten_lop_hoc: item.lophoc?.TenLopHoc || null,
      thoi_gian_bat_dau: item.ThoiGianBatDau,
      thoi_gian_nop: item.ThoiGianNop,
      tong_diem: item.TongDiem,
      trang_thai: item.TrangThai,
      so_luong_cau_tra_loi: item._count.bailam_chitiet,
      created_at: item.CreatedAt,
      updated_at: item.UpdatedAt,
    }));

    return {
      total_items,
      total_pages,
      current_page: page,
      limit,
      data: formattedData,
    };
  }

  /**
   * Lấy danh sách bài làm của học viên
   */
  async getListByHocVien(hocVienId: number) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    const data = await prisma.bailam.findMany({
      where: { HocVienID: hocVienId },
      include: {
        baikiemtra: {
          select: {
            BaiKiemTraID: true,
            TenBaiKiemTra: true,
          },
        },
        lophoc: {
          select: {
            TenLopHoc: true,
          },
        },
        _count: {
          select: {
            bailam_chitiet: true,
          },
        },
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    return data.map((item) => ({
      id: item.BaiLamID,
      bai_kiem_tra_id: item.BaiKiemTraID,
      ten_bai_kiem_tra: item.baikiemtra?.TenBaiKiemTra || null,
      lop_hoc: item.lophoc?.TenLopHoc || null,
      thoi_gian_bat_dau: item.ThoiGianBatDau,
      thoi_gian_nop: item.ThoiGianNop,
      tong_diem: item.TongDiem,
      trang_thai: item.TrangThai,
      so_luong_cau_tra_loi: item._count.bailam_chitiet,
      created_at: item.CreatedAt,
    }));
  }

  /**
   * Lấy danh sách bài làm của bài kiểm tra
   */
  async getListByBaiKiemTra(baiKiemTraId: number) {
    const baiKiemTra = await prisma.baikiemtra.findUnique({
      where: { BaiKiemTraID: baiKiemTraId },
    });

    if (!baiKiemTra) {
      throw new AppError('Bài kiểm tra không tồn tại', 404);
    }

    const data = await prisma.bailam.findMany({
      where: { BaiKiemTraID: baiKiemTraId },
      include: {
        hocvien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
                Email: true,
              },
            },
          },
        },
        lophoc: {
          select: {
            TenLopHoc: true,
          },
        },
        _count: {
          select: {
            bailam_chitiet: true,
          },
        },
      },
      orderBy: {
        TongDiem: 'desc',
      },
    });

    return data.map((item) => ({
      id: item.BaiLamID,
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      lop_hoc: item.lophoc?.TenLopHoc || null,
      thoi_gian_bat_dau: item.ThoiGianBatDau,
      thoi_gian_nop: item.ThoiGianNop,
      tong_diem: item.TongDiem,
      trang_thai: item.TrangThai,
      so_luong_cau_tra_loi: item._count.bailam_chitiet,
      created_at: item.CreatedAt,
    }));
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'DANG_LAM', label: 'Đang làm' },
      { value: 'DA_NOP', label: 'Đã nộp' },
      { value: 'HET_GIO', label: 'Hết giờ' },
    ];
  }

  /**
   * Lấy chi tiết bài làm
   */
  async getById(id: number) {
    const baiLam = await prisma.bailam.findUnique({
      where: { BaiLamID: id },
      include: {
        baikiemtra: true,
        hocvien: {
          include: {
            taikhoan: true,
          },
        },
        lophoc: true,
        bailam_chitiet: {
          include: {
            cauhoi: {
              include: {
                dapan: {
                  orderBy: {
                    ThuTuHienThi: 'asc',
                  },
                },
              },
            },
            dapan: true,
          },
          orderBy: {
            CauHoiID: 'asc',
          },
        },
      },
    });

    if (!baiLam) {
      throw new AppError('Bài làm không tồn tại', 404);
    }

    return {
      id: baiLam.BaiLamID,
      bai_kiem_tra: baiLam.baikiemtra,
      hoc_vien: baiLam.hocvien,
      lop_hoc: baiLam.lophoc,
      thoi_gian_bat_dau: baiLam.ThoiGianBatDau,
      thoi_gian_nop: baiLam.ThoiGianNop,
      tong_diem: baiLam.TongDiem,
      trang_thai: baiLam.TrangThai,
      chi_tiet: baiLam.bailam_chitiet.map((item) => ({
        cau_hoi_id: item.CauHoiID,
        cau_hoi: item.cauhoi,
        dap_an_id: item.DapAnID,
        dap_an: item.dapan,
        noi_dung_tra_loi: item.NoiDungTraLoi,
        la_dung: item.LaDung,
      })),
      created_at: baiLam.CreatedAt,
      updated_at: baiLam.UpdatedAt,
    };
  }

  /**
   * Tạo bài làm mới
   */
  async create(data: CreateBaiLamDto) {
    const { BaiKiemTraID, HocVienID, LopHocID, ThoiGianBatDau, ThoiGianNop, TongDiem, TrangThai } = data;

    // Kiểm tra bài kiểm tra tồn tại
    const baiKiemTra = await prisma.baikiemtra.findUnique({
      where: { BaiKiemTraID },
    });

    if (!baiKiemTra) {
      throw new AppError('Bài kiểm tra không tồn tại', 404);
    }

    // Kiểm tra học viên tồn tại
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Kiểm tra lớp học tồn tại
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    // Kiểm tra đã làm bài chưa
    const existing = await prisma.bailam.findFirst({
      where: {
        BaiKiemTraID,
        HocVienID,
        LopHocID,
      },
    });

    if (existing) {
      throw new AppError('Học viên đã làm bài kiểm tra này', 409);
    }

    const baiLam = await prisma.bailam.create({
      data: {
        BaiKiemTraID,
        HocVienID,
        LopHocID,
        ThoiGianBatDau,
        ThoiGianNop: ThoiGianNop || null,
        TongDiem: TongDiem || 0,
        TrangThai: TrangThai || 'DANG_LAM',
      },
    });

    return {
      id: baiLam.BaiLamID,
      bai_kiem_tra_id: baiLam.BaiKiemTraID,
      hoc_vien_id: baiLam.HocVienID,
      lop_hoc_id: baiLam.LopHocID,
      thoi_gian_bat_dau: baiLam.ThoiGianBatDau,
      thoi_gian_nop: baiLam.ThoiGianNop,
      tong_diem: baiLam.TongDiem,
      trang_thai: baiLam.TrangThai,
      created_at: baiLam.CreatedAt,
    };
  }

  /**
   * Cập nhật bài làm
   */
  async update(id: number, data: UpdateBaiLamDto) {
    const { ThoiGianNop, TongDiem, TrangThai } = data;

    const existing = await prisma.bailam.findUnique({
      where: { BaiLamID: id },
    });

    if (!existing) {
      throw new AppError('Bài làm không tồn tại', 404);
    }

    const baiLam = await prisma.bailam.update({
      where: { BaiLamID: id },
      data: {
        ThoiGianNop,
        TongDiem,
        TrangThai,
      },
    });

    return {
      id: baiLam.BaiLamID,
      bai_kiem_tra_id: baiLam.BaiKiemTraID,
      hoc_vien_id: baiLam.HocVienID,
      lop_hoc_id: baiLam.LopHocID,
      thoi_gian_bat_dau: baiLam.ThoiGianBatDau,
      thoi_gian_nop: baiLam.ThoiGianNop,
      tong_diem: baiLam.TongDiem,
      trang_thai: baiLam.TrangThai,
      updated_at: baiLam.UpdatedAt,
    };
  }

  /**
   * Xóa bài làm
   */
  async delete(id: number) {
    const existing = await prisma.bailam.findUnique({
      where: { BaiLamID: id },
      include: {
        bailam_chitiet: true,
      },
    });

    if (!existing) {
      throw new AppError('Bài làm không tồn tại', 404);
    }

    // Xóa chi tiết trước (cascade sẽ tự xóa nhưng vẫn nên kiểm tra)
    if (existing.bailam_chitiet.length > 0) {
      await prisma.bailam_chitiet.deleteMany({
        where: { BaiLamID: id },
      });
    }

    await prisma.bailam.delete({
      where: { BaiLamID: id },
    });

    return {
      id: existing.BaiLamID,
      message: 'Xóa bài làm thành công',
    };
  }

  // =============================================
  // BÀI LÀM CHI TIẾT
  // =============================================

  /**
   * Thêm chi tiết bài làm
   */
  async addChiTiet(baiLamId: number, data: CreateBaiLamChiTietDto) {
    const { CauHoiID, DapAnID, NoiDungTraLoi, LaDung } = data;

    // Kiểm tra bài làm tồn tại
    const baiLam = await prisma.bailam.findUnique({
      where: { BaiLamID: baiLamId },
    });

    if (!baiLam) {
      throw new AppError('Bài làm không tồn tại', 404);
    }

    // Kiểm tra câu hỏi tồn tại
    const cauHoi = await prisma.cauhoi.findUnique({
      where: { CauHoiID },
    });

    if (!cauHoi) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    // Kiểm tra đã có chi tiết cho câu hỏi này chưa
    const existing = await prisma.bailam_chitiet.findFirst({
      where: {
        BaiLamID: baiLamId,
        CauHoiID,
      },
    });

    if (existing) {
      throw new AppError('Đã có câu trả lời cho câu hỏi này', 409);
    }

    // Nếu có DapAnID, kiểm tra tồn tại và thuộc câu hỏi
    if (DapAnID) {
      const dapAn = await prisma.dapan.findFirst({
        where: {
          DapAnID,
          CauHoiID,
        },
      });

      if (!dapAn) {
        throw new AppError('Đáp án không tồn tại hoặc không thuộc câu hỏi này', 404);
      }
    }

    const chiTiet = await prisma.bailam_chitiet.create({
      data: {
        BaiLamID: baiLamId,
        CauHoiID,
        DapAnID: DapAnID || null,
        NoiDungTraLoi: NoiDungTraLoi || null,
        LaDung: LaDung || null,
      },
    });

    // Cập nhật tổng điểm của bài làm
    await this.updateTotalScore(baiLamId);

    return {
      bai_lam_id: chiTiet.BaiLamID,
      cau_hoi_id: chiTiet.CauHoiID,
      dap_an_id: chiTiet.DapAnID,
      noi_dung_tra_loi: chiTiet.NoiDungTraLoi,
      la_dung: chiTiet.LaDung,
    };
  }

  /**
   * Cập nhật chi tiết bài làm
   */
  async updateChiTiet(baiLamId: number, cauHoiId: number, data: UpdateBaiLamChiTietDto) {
    const { DapAnID, NoiDungTraLoi, LaDung } = data;

    // Kiểm tra tồn tại
    const existing = await prisma.bailam_chitiet.findFirst({
      where: {
        BaiLamID: baiLamId,
        CauHoiID: cauHoiId,
      },
    });

    if (!existing) {
      throw new AppError('Chi tiết bài làm không tồn tại', 404);
    }

    // Nếu có DapAnID, kiểm tra tồn tại
    if (DapAnID) {
      const dapAn = await prisma.dapan.findFirst({
        where: {
          DapAnID,
          CauHoiID: cauHoiId,
        },
      });

      if (!dapAn) {
        throw new AppError('Đáp án không tồn tại hoặc không thuộc câu hỏi này', 404);
      }
    }

    const chiTiet = await prisma.bailam_chitiet.update({
      where: {
        BaiLamID_CauHoiID: {
          BaiLamID: baiLamId,
          CauHoiID: cauHoiId,
        },
      },
      data: {
        DapAnID: DapAnID || null,
        NoiDungTraLoi: NoiDungTraLoi || null,
        LaDung: LaDung || null,
      },
    });

    // Cập nhật tổng điểm của bài làm
    await this.updateTotalScore(baiLamId);

    return {
      bai_lam_id: chiTiet.BaiLamID,
      cau_hoi_id: chiTiet.CauHoiID,
      dap_an_id: chiTiet.DapAnID,
      noi_dung_tra_loi: chiTiet.NoiDungTraLoi,
      la_dung: chiTiet.LaDung,
      updated_at: chiTiet.UpdatedAt,
    };
  }

  /**
   * Xóa chi tiết bài làm
   */
  async deleteChiTiet(baiLamId: number, cauHoiId: number) {
    const existing = await prisma.bailam_chitiet.findFirst({
      where: {
        BaiLamID: baiLamId,
        CauHoiID: cauHoiId,
      },
    });

    if (!existing) {
      throw new AppError('Chi tiết bài làm không tồn tại', 404);
    }

    await prisma.bailam_chitiet.delete({
      where: {
        BaiLamID_CauHoiID: {
          BaiLamID: baiLamId,
          CauHoiID: cauHoiId,
        },
      },
    });

    // Cập nhật tổng điểm của bài làm
    await this.updateTotalScore(baiLamId);

    return {
      message: 'Xóa chi tiết bài làm thành công',
      bai_lam_id: baiLamId,
      cau_hoi_id: cauHoiId,
    };
  }

  /**
   * Tính lại tổng điểm bài làm
   */
  async updateTotalScore(baiLamId: number) {
    const chiTiets = await prisma.bailam_chitiet.findMany({
      where: { BaiLamID: baiLamId },
    });

    // Đếm số câu đúng (LaDung = true)
    const soCauDung = chiTiets.filter((item) => item.LaDung === true).length;

    // Cập nhật tổng điểm
    await prisma.bailam.update({
      where: { BaiLamID: baiLamId },
      data: {
        TongDiem: soCauDung,
      },
    });

    return { so_cau_dung: soCauDung };
  }
}