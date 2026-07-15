// src/modules/dotkhaigiang/services/dotkhaigiang.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateDotKhaiGiangDto, UpdateDotKhaiGiangDto, DotKhaiGiangQueryDto } from '../dto/index.js';

export class DotKhaiGiangService {
  /**
   * Lấy danh sách đợt khai giảng (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: DotKhaiGiangQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    // Xây dựng điều kiện where
    const where: any = {};

    // Tìm kiếm theo mã hoặc tên
    if (search) {
      where.OR = [
        { MaDot: { contains: search,  } },
        { TenDot: { contains: search,  } },
      ];
    }

    // Lọc theo trạng thái
    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    // Tính tổng số items
    const total_items = await prisma.dotkhaigiang.count({ where });

    // Tính số trang
    const total_pages = Math.ceil(total_items / limit);

    // Xác định field sắp xếp
    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      MaDot: 'MaDot',
      TenDot: 'TenDot',
      NgayMoDangKy: 'NgayMoDangKy',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    // Lấy dữ liệu
    const data = await prisma.dotkhaigiang.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format dữ liệu trả về
    const formattedData = data.map((item) => ({
      id: item.DotKhaiGiangID,
      ma_dot: item.MaDot,
      ten_dot: item.TenDot,
      ngay_mo_dang_ky: item.NgayMoDangKy,
      ngay_dong_dang_ky: item.NgayDongDangKy,
      mo_ta: item.MoTa,
      trang_thai: item.TrangThai,
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
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'SAP_MO', label: 'Sắp mở' },
      { value: 'DANG_MO', label: 'Đang mở' },
      { value: 'DA_DONG', label: 'Đã đóng' },
    ];
  }

  /**
   * Lấy danh sách đợt khai giảng (dropdown)
   */
  async getOptions() {
    const dotKhaiGiangs = await prisma.dotkhaigiang.findMany({
      where: {
        TrangThai: {
          in: ['SAP_MO', 'DANG_MO'],
        },
      },
      orderBy: {
        NgayMoDangKy: 'asc',
      },
    });

    return dotKhaiGiangs.map((item) => ({
      value: item.DotKhaiGiangID,
      label: `${item.MaDot} - ${item.TenDot}`,
    }));
  }

  /**
   * Lấy chi tiết đợt khai giảng
   */
  async getById(id: number) {
    const dotKhaiGiang = await prisma.dotkhaigiang.findUnique({
      where: { DotKhaiGiangID: id },
      include: {
        lophoc: {
          where: {
            TrangThai: {
              not: 'DA_HUY',
            },
          },
          select: {
            LopHocID: true,
            TenLopHoc: true,
            HinhThucHoc: true,
            SiSoToiDa: true,
            TrangThai: true,
          },
        },
      },
    });

    if (!dotKhaiGiang) {
      throw new AppError('Đợt khai giảng không tồn tại', 404);
    }

    return {
      id: dotKhaiGiang.DotKhaiGiangID,
      ma_dot: dotKhaiGiang.MaDot,
      ten_dot: dotKhaiGiang.TenDot,
      ngay_mo_dang_ky: dotKhaiGiang.NgayMoDangKy,
      ngay_dong_dang_ky: dotKhaiGiang.NgayDongDangKy,
      mo_ta: dotKhaiGiang.MoTa,
      trang_thai: dotKhaiGiang.TrangThai,
      so_luong_lop: dotKhaiGiang.lophoc.length,
      danh_sach_lop: dotKhaiGiang.lophoc,
      created_at: dotKhaiGiang.CreatedAt,
      updated_at: dotKhaiGiang.UpdatedAt,
    };
  }

  /**
   * Lấy đợt khai giảng theo mã
   */
  async getByMaDot(maDot: string) {
    const dotKhaiGiang = await prisma.dotkhaigiang.findUnique({
      where: { MaDot: maDot },
    });

    if (!dotKhaiGiang) {
      throw new AppError('Đợt khai giảng không tồn tại', 404);
    }

    return dotKhaiGiang;
  }

  /**
   * Tạo đợt khai giảng mới
   */
  async create(data: CreateDotKhaiGiangDto) {
    const { MaDot, TenDot, NgayMoDangKy, NgayDongDangKy, MoTa, TrangThai } = data;

    // Kiểm tra mã đợt đã tồn tại
    const existing = await prisma.dotkhaigiang.findUnique({
      where: { MaDot },
    });

    if (existing) {
      throw new AppError('Mã đợt đã tồn tại', 409);
    }

    // Xác định trạng thái dựa trên ngày
    let trangThai = TrangThai;
    const now = new Date();
    if (!trangThai) {
      if (NgayMoDangKy > now) {
        trangThai = 'SAP_MO';
      } else if (NgayMoDangKy <= now && NgayDongDangKy >= now) {
        trangThai = 'DANG_MO';
      } else {
        trangThai = 'DA_DONG';
      }
    }

    // Tạo đợt khai giảng
    const dotKhaiGiang = await prisma.dotkhaigiang.create({
      data: {
        MaDot,
        TenDot,
        NgayMoDangKy,
        NgayDongDangKy,
        MoTa: MoTa || null,
        TrangThai: trangThai,
      },
    });

    return {
      id: dotKhaiGiang.DotKhaiGiangID,
      ma_dot: dotKhaiGiang.MaDot,
      ten_dot: dotKhaiGiang.TenDot,
      ngay_mo_dang_ky: dotKhaiGiang.NgayMoDangKy,
      ngay_dong_dang_ky: dotKhaiGiang.NgayDongDangKy,
      mo_ta: dotKhaiGiang.MoTa,
      trang_thai: dotKhaiGiang.TrangThai,
      created_at: dotKhaiGiang.CreatedAt,
    };
  }

  /**
   * Cập nhật đợt khai giảng
   */
  async update(id: number, data: UpdateDotKhaiGiangDto) {
    const { MaDot, TenDot, NgayMoDangKy, NgayDongDangKy, MoTa, TrangThai } = data;

    // Kiểm tra tồn tại
    const existing = await prisma.dotkhaigiang.findUnique({
      where: { DotKhaiGiangID: id },
    });

    if (!existing) {
      throw new AppError('Đợt khai giảng không tồn tại', 404);
    }

    // Kiểm tra mã đợt không trùng với khác
    if (MaDot && MaDot !== existing.MaDot) {
      const duplicate = await prisma.dotkhaigiang.findUnique({
        where: { MaDot },
      });

      if (duplicate) {
        throw new AppError('Mã đợt đã tồn tại', 409);
      }
    }

    // Cập nhật
    const dotKhaiGiang = await prisma.dotkhaigiang.update({
      where: { DotKhaiGiangID: id },
      data: {
        MaDot,
        TenDot,
        NgayMoDangKy,
        NgayDongDangKy,
        MoTa,
        TrangThai,
      },
    });

    return {
      id: dotKhaiGiang.DotKhaiGiangID,
      ma_dot: dotKhaiGiang.MaDot,
      ten_dot: dotKhaiGiang.TenDot,
      ngay_mo_dang_ky: dotKhaiGiang.NgayMoDangKy,
      ngay_dong_dang_ky: dotKhaiGiang.NgayDongDangKy,
      mo_ta: dotKhaiGiang.MoTa,
      trang_thai: dotKhaiGiang.TrangThai,
      updated_at: dotKhaiGiang.UpdatedAt,
    };
  }

  /**
   * Xóa đợt khai giảng
   */
  async delete(id: number) {
    // Kiểm tra tồn tại
    const existing = await prisma.dotkhaigiang.findUnique({
      where: { DotKhaiGiangID: id },
      include: {
        lophoc: {
          where: {
            TrangThai: {
              in: ['SAP_KHAI_GIANG', 'DANG_HOC'],
            },
          },
        },
      },
    });

    if (!existing) {
      throw new AppError('Đợt khai giảng không tồn tại', 404);
    }

    // Kiểm tra có lớp học đang hoạt động không
    if (existing.lophoc.length > 0) {
      throw new AppError('Không thể xóa đợt khai giảng đang có lớp học hoạt động', 400);
    }

    // Xóa
    await prisma.dotkhaigiang.delete({
      where: { DotKhaiGiangID: id },
    });

    return {
      id: existing.DotKhaiGiangID,
      message: 'Xóa đợt khai giảng thành công',
    };
  }
}