// src/modules/khoahoc/services/khoahoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateKhoaHocDto, UpdateKhoaHocDto, KhoaHocQueryDto } from '../dto/index.js';

export class KhoaHocService {
  /**
   * Lấy danh sách khóa học (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: KhoaHocQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      trinhDo,
      status = 'ALL',
      sort_by = 'createdAt',
      order = 'desc',
    } = query;

    const where: any = { IsDeleted: false };

    if (search) {
      where.TenKhoaHoc = { contains: search };
    }

    if (trinhDo) {
      const trinhDoItem = await prisma.danhmuc.findFirst({
        where: { TenDanhMuc: trinhDo, IsDeleted: false },
      });
      if (trinhDoItem) where.TrinhDoID = trinhDoItem.DanhMucID;
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const totalItems = await prisma.khoahoc.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const sortFieldMap: Record<string, string> = {
      createdAt: 'CreatedAt',
      tenKhoaHoc: 'TenKhoaHoc',
      hocPhi: 'HocPhi',
      trangThai: 'TrangThai',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    const orderBy: any = { [sortField]: order };

    const data = await prisma.khoahoc.findMany({
      where,
      include: {
        trinhdo: { select: { DanhMucID: true, TenDanhMuc: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      khoaHocID: item.KhoaHocID,
      tenKhoaHoc: item.TenKhoaHoc,
      trinhDoID: item.TrinhDoID,
      trinhDo: item.trinhdo?.TenDanhMuc || null,
      hocPhi: item.HocPhi,
      moTa: item.MoTa,
      trangThai: item.TrangThai,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
    }));

    return {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
      data: formattedData,
    };
  }

  /**
   * Lấy danh sách khóa học (dropdown)
   */
  async getOptions() {
    const khoaHocs = await prisma.khoahoc.findMany({
      where: { IsDeleted: false, TrangThai: 'DANG_MO' },
      include: { trinhdo: { select: { TenDanhMuc: true } } },
      orderBy: { TenKhoaHoc: 'asc' },
    });

    return khoaHocs.map((item) => ({
      value: item.KhoaHocID,
      label: `${item.TenKhoaHoc} (${item.trinhdo?.TenDanhMuc || 'N/A'})`,
    }));
  }

  /**
   * Lấy trình độ (dropdown)
   */
  async getTrinhDoOptions() {
    const trinhDos = await prisma.danhmuc.findMany({
      where: {
        danhMucCha: { TenDanhMuc: 'Trình độ' },
        IsDeleted: false,
        TrangThai: 'HOAT_DONG',
      },
      orderBy: { ThuTuHienThi: 'asc' },
    });

    return trinhDos.map((item) => ({
      value: item.DanhMucID,
      label: item.TenDanhMuc,
    }));
  }

  /**
   * Lấy trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'SAP_MO', label: 'Sắp mở' },
      { value: 'DANG_MO', label: 'Đang mở' },
      { value: 'TAM_DUNG', label: 'Tạm dừng' },
    ];
  }

  /**
   * Lấy chi tiết khóa học
   */
  async getById(id: number) {
    const khoaHoc = await prisma.khoahoc.findUnique({
      where: { KhoaHocID: id },
      include: {
        trinhdo: { select: { DanhMucID: true, TenDanhMuc: true } },
        baihoc: {
          where: { TrangThai: 'HIEN' },
          orderBy: { ThuTuHienThi: 'asc' },
          include: {
            phanbaihoc: {
              where: { TrangThai: 'HIEN' },
              orderBy: { ThuTuHienThi: 'asc' },
            },
          },
        },
      },
    });

    if (!khoaHoc || khoaHoc.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    const soLuongBaiHoc = khoaHoc.baihoc.length;
    const soLuongPhanBaiHoc = khoaHoc.baihoc.reduce(
      (sum, b) => sum + b.phanbaihoc.length,
      0
    );

    return {
      khoaHocID: khoaHoc.KhoaHocID,
      tenKhoaHoc: khoaHoc.TenKhoaHoc,
      trinhDoID: khoaHoc.TrinhDoID,
      trinhDo: khoaHoc.trinhdo?.TenDanhMuc || null,
      hocPhi: khoaHoc.HocPhi,
      moTa: khoaHoc.MoTa,
      trangThai: khoaHoc.TrangThai,
      soLuongBaiHoc: soLuongBaiHoc,
      soLuongPhanBaiHoc: soLuongPhanBaiHoc,
      createdAt: khoaHoc.CreatedAt,
      updatedAt: khoaHoc.UpdatedAt,
      baiHocs: khoaHoc.baihoc.map((bai) => ({
        baiHocID: bai.BaiHocID,
        tenBaiHoc: bai.TenBaiHoc,
        moTa: bai.MoTa,
        thuTuHienThi: bai.ThuTuHienThi,
        soLuongPhan: bai.phanbaihoc.length,
      })),
    };
  }

  /**
   * Tạo khóa học mới
   */
  async create(data: CreateKhoaHocDto) {
    const { tenKhoaHoc, trinhDoID, hocPhi, moTa, trangThai } = data;

    const existing = await prisma.khoahoc.findFirst({
      where: { TenKhoaHoc: tenKhoaHoc, IsDeleted: false },
    });

    if (existing) {
      throw new AppError('Tên khóa học đã tồn tại', 409);
    }

    const trinhDo = await prisma.danhmuc.findUnique({
      where: { DanhMucID: trinhDoID },
    });

    if (!trinhDo || trinhDo.IsDeleted) {
      throw new AppError('Trình độ không tồn tại', 404);
    }

    const khoaHoc = await prisma.khoahoc.create({
      data: {
        TenKhoaHoc: tenKhoaHoc,
        TrinhDoID: trinhDoID,
        HocPhi: hocPhi || 0,
        MoTa: moTa || null,
        TrangThai: trangThai || 'DANG_MO',
        IsDeleted: false,
      },
      include: { trinhdo: { select: { TenDanhMuc: true } } },
    });

    return {
      khoaHocID: khoaHoc.KhoaHocID,
      tenKhoaHoc: khoaHoc.TenKhoaHoc,
      trinhDo: khoaHoc.trinhdo?.TenDanhMuc || null,
      hocPhi: khoaHoc.HocPhi,
      moTa: khoaHoc.MoTa,
      trangThai: khoaHoc.TrangThai,
      createdAt: khoaHoc.CreatedAt,
    };
  }

  /**
   * Cập nhật khóa học
   */
  async update(id: number, data: UpdateKhoaHocDto) {
    const { tenKhoaHoc, trinhDoID, hocPhi, moTa, trangThai } = data;

    const existing = await prisma.khoahoc.findUnique({
      where: { KhoaHocID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    if (tenKhoaHoc) {
      const duplicate = await prisma.khoahoc.findFirst({
        where: {
          TenKhoaHoc: tenKhoaHoc,
          KhoaHocID: { not: id },
          IsDeleted: false,
        },
      });
      if (duplicate) throw new AppError('Tên khóa học đã tồn tại', 409);
    }

    if (trinhDoID) {
      const trinhDo = await prisma.danhmuc.findUnique({
        where: { DanhMucID: trinhDoID },
      });
      if (!trinhDo || trinhDo.IsDeleted) {
        throw new AppError('Trình độ không tồn tại', 404);
      }
    }

    const khoaHoc = await prisma.khoahoc.update({
      where: { KhoaHocID: id },
      data: {
        TenKhoaHoc: tenKhoaHoc,
        TrinhDoID: trinhDoID,
        HocPhi: hocPhi,
        MoTa: moTa,
        TrangThai: trangThai,
      },
      include: { trinhdo: { select: { TenDanhMuc: true } } },
    });

    return {
      khoaHocID: khoaHoc.KhoaHocID,
      tenKhoaHoc: khoaHoc.TenKhoaHoc,
      trinhDo: khoaHoc.trinhdo?.TenDanhMuc || null,
      hocPhi: khoaHoc.HocPhi,
      moTa: khoaHoc.MoTa,
      trangThai: khoaHoc.TrangThai,
      updatedAt: khoaHoc.UpdatedAt,
    };
  }

  /**
   * Xóa khóa học (xóa mềm)
   */
  async delete(id: number) {
    const existing = await prisma.khoahoc.findUnique({
      where: { KhoaHocID: id },
      include: {
        lophoc: {
          where: {
            TrangThai: { in: ['SAP_KHAI_GIANG', 'DANG_HOC'] },
          },
        },
      },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    if (existing.lophoc.length > 0) {
      throw new AppError('Không thể xóa khóa học đang có lớp học hoạt động', 400);
    }

    const khoaHoc = await prisma.khoahoc.update({
      where: { KhoaHocID: id },
      data: { IsDeleted: true, TrangThai: 'TAM_DUNG' },
    });

    return { khoaHocID: khoaHoc.KhoaHocID, message: 'Xóa khóa học thành công' };
  }
}