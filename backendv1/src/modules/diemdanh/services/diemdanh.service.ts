// src/modules/diemdanh/services/diemdanh.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  CreateDiemDanhDto,
  UpdateDiemDanhDto,
  DiemDanhQueryDto,
  CreateMaDiemDanhDto,
} from '../dto/index.js';

export class DiemDanhService {
  // =============================================
  // ĐIỂM DANH HỌC VIÊN
  // =============================================

  /**
   * Lấy danh sách điểm danh (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: DiemDanhQueryDto) {
    const {
      page = 1,
      limit = 10,
      buoiHoc,
      hocVien,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (buoiHoc) {
      where.BuoiHocID = buoiHoc;
    }

    if (hocVien) {
      where.HocVienID = hocVien;
    }

    if (status && status !== 'ALL') {
      where.TrangThaiDiemDanh = status;
    }

    const total_items = await prisma.hocvien_diemdanh.count({ where });
    const total_pages = Math.ceil(total_items / limit);

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      ThoiGianCheckIn: 'ThoiGianCheckIn',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    const data = await prisma.hocvien_diemdanh.findMany({
      where,
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
        buoihoc: {
          include: {
            cahoc: true,
            lophoc: {
              select: {
                TenLopHoc: true,
              },
            },
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      buoi_hoc_id: item.BuoiHocID,
      ngay_hoc: item.buoihoc?.NgayHoc || null,
      lop_hoc: item.buoihoc?.lophoc?.TenLopHoc || null,
      ca_hoc: item.buoihoc?.cahoc?.TenCa || null,
      trang_thai_diem_danh: item.TrangThaiDiemDanh,
      thoi_gian_check_in: item.ThoiGianCheckIn,
      ghi_chu: item.GhiChu,
      created_at: item.CreatedAt,
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
   * Lấy danh sách điểm danh của một buổi học
   */
  async getListByBuoiHoc(buoiHocId: number) {
    const buoiHoc = await prisma.buoihoc.findUnique({
      where: { BuoiHocID: buoiHocId },
    });

    if (!buoiHoc) {
      throw new AppError('Buổi học không tồn tại', 404);
    }

    const data = await prisma.hocvien_diemdanh.findMany({
      where: { BuoiHocID: buoiHocId },
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
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    return data.map((item) => ({
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      trang_thai_diem_danh: item.TrangThaiDiemDanh,
      thoi_gian_check_in: item.ThoiGianCheckIn,
      ghi_chu: item.GhiChu,
      created_at: item.CreatedAt,
    }));
  }

  /**
   * Lấy danh sách điểm danh của một học viên
   */
  async getListByHocVien(hocVienId: number) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    const data = await prisma.hocvien_diemdanh.findMany({
      where: { HocVienID: hocVienId },
      include: {
        buoihoc: {
          include: {
            cahoc: true,
            lophoc: {
              select: {
                TenLopHoc: true,
              },
            },
          },
        },
      },
      orderBy: {
        BuoiHocID: 'desc',
      },
    });

    return data.map((item) => ({
      buoi_hoc_id: item.BuoiHocID,
      ngay_hoc: item.buoihoc?.NgayHoc || null,
      lop_hoc: item.buoihoc?.lophoc?.TenLopHoc || null,
      ca_hoc: item.buoihoc?.cahoc?.TenCa || null,
      trang_thai_diem_danh: item.TrangThaiDiemDanh,
      thoi_gian_check_in: item.ThoiGianCheckIn,
      ghi_chu: item.GhiChu,
      created_at: item.CreatedAt,
    }));
  }

  /**
   * Tạo điểm danh mới
   */
  async create(data: CreateDiemDanhDto) {
    const { HocVienID, BuoiHocID, TrangThaiDiemDanh, ThoiGianCheckIn, GhiChu } = data;

    // Kiểm tra học viên tồn tại
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Kiểm tra buổi học tồn tại
    const buoiHoc = await prisma.buoihoc.findUnique({
      where: { BuoiHocID },
    });

    if (!buoiHoc) {
      throw new AppError('Buổi học không tồn tại', 404);
    }

    // Kiểm tra đã điểm danh chưa
    const existing = await prisma.hocvien_diemdanh.findFirst({
      where: {
        HocVienID,
        BuoiHocID,
      },
    });

    if (existing) {
      throw new AppError('Học viên đã được điểm danh trong buổi học này', 409);
    }

    const diemDanh = await prisma.hocvien_diemdanh.create({
      data: {
        HocVienID,
        BuoiHocID,
        TrangThaiDiemDanh,
        ThoiGianCheckIn: ThoiGianCheckIn || null,
        GhiChu: GhiChu || null,
      },
    });

    return {
      hoc_vien_id: diemDanh.HocVienID,
      buoi_hoc_id: diemDanh.BuoiHocID,
      trang_thai_diem_danh: diemDanh.TrangThaiDiemDanh,
      thoi_gian_check_in: diemDanh.ThoiGianCheckIn,
      ghi_chu: diemDanh.GhiChu,
    };
  }

  /**
   * Cập nhật điểm danh
   */
  async update(hocVienId: number, buoiHocId: number, data: UpdateDiemDanhDto) {
    const { TrangThaiDiemDanh, ThoiGianCheckIn, GhiChu } = data;

    const existing = await prisma.hocvien_diemdanh.findFirst({
      where: {
        HocVienID: hocVienId,
        BuoiHocID: buoiHocId,
      },
    });

    if (!existing) {
      throw new AppError('Điểm danh không tồn tại', 404);
    }

    const diemDanh = await prisma.hocvien_diemdanh.update({
      where: {
        HocVienID_BuoiHocID: {
          HocVienID: hocVienId,
          BuoiHocID: buoiHocId,
        },
      },
      data: {
        TrangThaiDiemDanh,
        ThoiGianCheckIn,
        GhiChu,
      },
    });

    return {
      hoc_vien_id: diemDanh.HocVienID,
      buoi_hoc_id: diemDanh.BuoiHocID,
      trang_thai_diem_danh: diemDanh.TrangThaiDiemDanh,
      thoi_gian_check_in: diemDanh.ThoiGianCheckIn,
      ghi_chu: diemDanh.GhiChu,
      updated_at: diemDanh.UpdatedAt,
    };
  }

  /**
   * Xóa điểm danh
   */
  async delete(hocVienId: number, buoiHocId: number) {
    const existing = await prisma.hocvien_diemdanh.findFirst({
      where: {
        HocVienID: hocVienId,
        BuoiHocID: buoiHocId,
      },
    });

    if (!existing) {
      throw new AppError('Điểm danh không tồn tại', 404);
    }

    await prisma.hocvien_diemdanh.delete({
      where: {
        HocVienID_BuoiHocID: {
          HocVienID: hocVienId,
          BuoiHocID: buoiHocId,
        },
      },
    });

    return {
      message: 'Xóa điểm danh thành công',
      hoc_vien_id: hocVienId,
      buoi_hoc_id: buoiHocId,
    };
  }

  /**
   * Lấy danh sách trạng thái điểm danh (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'CO_MAT', label: 'Có mặt' },
      { value: 'VANG_CO_PHEP', label: 'Vắng có phép' },
      { value: 'VANG_KHONG_PHEP', label: 'Vắng không phép' },
      { value: 'DI_MUON', label: 'Đi muộn' },
    ];
  }

  // =============================================
  // MÃ ĐIỂM DANH
  // =============================================

  /**
   * Tạo mã điểm danh mới
   */
  async createMaDiemDanh(data: CreateMaDiemDanhDto) {
    const { BuoiHocID, GiaoVienID, ThoiGianHetHan, TrangThai } = data;

    // Kiểm tra buổi học tồn tại
    const buoiHoc = await prisma.buoihoc.findUnique({
      where: { BuoiHocID },
    });

    if (!buoiHoc) {
      throw new AppError('Buổi học không tồn tại', 404);
    }

    // Kiểm tra giáo viên tồn tại
    const giaoVien = await prisma.giaovien.findUnique({
      where: { GiaoVienID },
    });

    if (!giaoVien) {
      throw new AppError('Giáo viên không tồn tại', 404);
    }

    // Tạo mã điểm danh
    const maDiemDanh = await prisma.madiemdanh.create({
      data: {
        BuoiHocID,
        GiaoVienID,
        NoiDungMaDiemDanh: `MDD${String(BuoiHocID).padStart(6, '0')}${Date.now().toString().slice(-4)}`,
        ThoiGianHetHan: ThoiGianHetHan || new Date(Date.now() + 15 * 60 * 1000), // 15 phút
        TrangThai: TrangThai || 'DANG_HOAT_DONG',
      },
    });

    return {
      id: maDiemDanh.MaDiemDanhID,
      buoi_hoc_id: maDiemDanh.BuoiHocID,
      giao_vien_id: maDiemDanh.GiaoVienID,
      noi_dung_ma: maDiemDanh.NoiDungMaDiemDanh,
      thoi_gian_het_han: maDiemDanh.ThoiGianHetHan,
      trang_thai: maDiemDanh.TrangThai,
      created_at: maDiemDanh.CreatedAt,
    };
  }

  /**
   * Lấy mã điểm danh của buổi học
   */
  async getMaDiemDanhByBuoiHoc(buoiHocId: number) {
    const buoiHoc = await prisma.buoihoc.findUnique({
      where: { BuoiHocID: buoiHocId },
    });

    if (!buoiHoc) {
      throw new AppError('Buổi học không tồn tại', 404);
    }

    const maDiemDanh = await prisma.madiemdanh.findFirst({
      where: {
        BuoiHocID: buoiHocId,
        TrangThai: 'DANG_HOAT_DONG',
      },
      orderBy: {
        CreatedAt: 'desc',
      },
    });

    if (!maDiemDanh) {
      return null;
    }

    return {
      id: maDiemDanh.MaDiemDanhID,
      buoi_hoc_id: maDiemDanh.BuoiHocID,
      giao_vien_id: maDiemDanh.GiaoVienID,
      noi_dung_ma: maDiemDanh.NoiDungMaDiemDanh,
      thoi_gian_het_han: maDiemDanh.ThoiGianHetHan,
      trang_thai: maDiemDanh.TrangThai,
      created_at: maDiemDanh.CreatedAt,
    };
  }

  /**
   * Xác thực mã điểm danh
   */
  async verifyMaDiemDanh(maCode: string) {
    const maDiemDanh = await prisma.madiemdanh.findFirst({
      where: {
        NoiDungMaDiemDanh: maCode,
        TrangThai: 'DANG_HOAT_DONG',
        ThoiGianHetHan: {
          gt: new Date(),
        },
      },
    });

    if (!maDiemDanh) {
      throw new AppError('Mã điểm danh không hợp lệ hoặc đã hết hạn', 400);
    }

    return {
      valid: true,
      buoi_hoc_id: maDiemDanh.BuoiHocID,
      ma_diem_danh_id: maDiemDanh.MaDiemDanhID,
    };
  }

  /**
   * Đóng mã điểm danh
   */
  async closeMaDiemDanh(maDiemDanhId: number) {
    const existing = await prisma.madiemdanh.findUnique({
      where: { MaDiemDanhID: maDiemDanhId },
    });

    if (!existing) {
      throw new AppError('Mã điểm danh không tồn tại', 404);
    }

    const maDiemDanh = await prisma.madiemdanh.update({
      where: { MaDiemDanhID: maDiemDanhId },
      data: {
        TrangThai: 'DA_DONG',
      },
    });

    return {
      id: maDiemDanh.MaDiemDanhID,
      trang_thai: maDiemDanh.TrangThai,
      message: 'Đã đóng mã điểm danh',
    };
  }

  /**
   * Lấy danh sách trạng thái mã điểm danh (dropdown)
   */
  async getMaStatusOptions() {
    return [
      { value: 'DANG_HOAT_DONG', label: 'Đang hoạt động' },
      { value: 'HET_HAN', label: 'Hết hạn' },
      { value: 'DA_DONG', label: 'Đã đóng' },
    ];
  }
}