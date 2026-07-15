// src/modules/danhmuc/services/danhmuc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateDanhMucDto, UpdateDanhMucDto, DanhMucQueryDto } from '../dto/index.js';

export class DanhMucService {
  /**
   * Lấy danh sách danh mục (có phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: DanhMucQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      status = 'ALL',
      sort_by = 'createdAt',
      order = 'desc',
    } = query;

    // Xây dựng điều kiện where
    const where: any = {
      IsDeleted: false,
    };

    // Tìm kiếm theo tên
    if (search) {
      where.TenDanhMuc = {
        contains: search,
      };
    }

    // Lọc theo loại danh mục (tìm danh mục có cha là type)
    if (type && type !== 'ALL') {
      const parent = await prisma.danhmuc.findFirst({
        where: {
          TenDanhMuc: type,
          IsDeleted: false,
        },
      });

      if (parent) {
        where.DanhMucChaID = parent.DanhMucID;
      }
    }

    // Lọc theo trạng thái
    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    // Tính tổng số items
    const totalItems = await prisma.danhmuc.count({ where });

    // Tính số trang
    const totalPages = Math.ceil(totalItems / limit);

    // Map sort_by từ camelCase sang Prisma field
    const sortFieldMap: Record<string, string> = {
      createdAt: 'CreatedAt',
      tenDanhMuc: 'TenDanhMuc',
      thuTuHienThi: 'ThuTuHienThi',
      updatedAt: 'UpdatedAt',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    const orderBy: any = { [sortField]: order };

    // Lấy dữ liệu
    const data = await prisma.danhmuc.findMany({
      where,
      include: {
        danhMucCha: {
          select: {
            DanhMucID: true,
            TenDanhMuc: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format dữ liệu trả về (camelCase)
    const formattedData = data.map((item) => ({
      id: item.DanhMucID,
      tenDanhMuc: item.TenDanhMuc,
      moTa: item.MoTa,
      thuTuHienThi: item.ThuTuHienThi,
      trangThai: item.TrangThai,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
      danhMucChaId: item.DanhMucChaID,
      tenDanhMucCha: item.danhMucCha?.TenDanhMuc || null,
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
   * Lấy danh sách loại danh mục (dùng cho dropdown)
   */
  async getTypes() {
    const rootCategories = await prisma.danhmuc.findMany({
      where: {
        DanhMucChaID: null,
        IsDeleted: false,
      },
      orderBy: {
        ThuTuHienThi: 'asc',
      },
    });

    return rootCategories.map((item) => ({
      value: item.DanhMucID,
      label: item.TenDanhMuc,
    }));
  }

  /**
   * Lấy danh sách danh mục cha (dùng cho dropdown khi thêm/sửa)
   */
  async getParents() {
    const parents = await prisma.danhmuc.findMany({
      where: {
        DanhMucChaID: null,
        IsDeleted: false,
      },
      orderBy: {
        ThuTuHienThi: 'asc',
      },
    });

    return parents.map((item) => ({
      value: item.DanhMucID,
      label: item.TenDanhMuc,
    }));
  }

  /**
   * Lấy danh sách tất cả (không phân trang - dùng cho dropdown)
   */
  async getAllOptions() {
    const categories = await prisma.danhmuc.findMany({
      where: {
        IsDeleted: false,
      },
      orderBy: [
        { ThuTuHienThi: 'asc' },
        { TenDanhMuc: 'asc' },
      ],
    });

    return categories.map((item) => ({
      value: item.DanhMucID,
      label: item.TenDanhMuc,
      parentId: item.DanhMucChaID,
    }));
  }

  /**
   * Lấy danh mục theo ID
   */
  async getById(id: number) {
    const danhMuc = await prisma.danhmuc.findUnique({
      where: { DanhMucID: id },
      include: {
        danhMucCha: {
          select: {
            DanhMucID: true,
            TenDanhMuc: true,
          },
        },
      },
    });

    if (!danhMuc) {
      throw new AppError('Danh mục không tồn tại', 404);
    }

    return {
      id: danhMuc.DanhMucID,
      tenDanhMuc: danhMuc.TenDanhMuc,
      moTa: danhMuc.MoTa,
      thuTuHienThi: danhMuc.ThuTuHienThi,
      trangThai: danhMuc.TrangThai,
      parentId: danhMuc.DanhMucChaID,
      parentName: danhMuc.danhMucCha?.TenDanhMuc || null,
      createdAt: danhMuc.CreatedAt,
      updatedAt: danhMuc.UpdatedAt,
    };
  }

  /**
   * Tạo danh mục mới
   */
  async create(data: CreateDanhMucDto) {
    // Kiểm tra tên danh mục đã tồn tại
    const existing = await prisma.danhmuc.findFirst({
      where: {
        TenDanhMuc: data.tenDanhMuc,
        IsDeleted: false,
      },
    });

    if (existing) {
      throw new AppError('Tên danh mục đã tồn tại', 409);
    }

    // Kiểm tra danh mục cha tồn tại
    if (data.danhMucChaId) {
      const parent = await prisma.danhmuc.findUnique({
        where: { DanhMucID: data.danhMucChaId },
      });

      if (!parent || parent.IsDeleted) {
        throw new AppError('Danh mục cha không tồn tại', 404);
      }
    }

    const danhMuc = await prisma.danhmuc.create({
      data: {
        TenDanhMuc: data.tenDanhMuc,
        MoTa: data.moTa || null,
        ThuTuHienThi: data.thuTuHienThi || 0,
        DanhMucChaID: data.danhMucChaId || null,
        TrangThai: data.trangThai || 'HOAT_DONG',
        IsDeleted: false,
      },
    });

    return {
      id: danhMuc.DanhMucID,
      tenDanhMuc: danhMuc.TenDanhMuc,
      moTa: danhMuc.MoTa,
      thuTuHienThi: danhMuc.ThuTuHienThi,
      trangThai: danhMuc.TrangThai,
      danhMucChaId: danhMuc.DanhMucChaID,
      createdAt: danhMuc.CreatedAt,
    };
  }

  /**
   * Cập nhật danh mục
   */
  async update(id: number, data: UpdateDanhMucDto) {
    // Kiểm tra danh mục tồn tại
    const existing = await prisma.danhmuc.findUnique({
      where: { DanhMucID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Danh mục không tồn tại', 404);
    }

    // Kiểm tra tên không trùng
    if (data.tenDanhMuc) {
      const duplicate = await prisma.danhmuc.findFirst({
        where: {
          TenDanhMuc: data.tenDanhMuc,
          DanhMucID: { not: id },
          IsDeleted: false,
        },
      });

      if (duplicate) {
        throw new AppError('Tên danh mục đã tồn tại', 409);
      }
    }

    // Kiểm tra danh mục cha
    if (data.danhMucChaId) {
      if (data.danhMucChaId === id) {
        throw new AppError('Không thể đặt danh mục là cha của chính nó', 400);
      }

      const parent = await prisma.danhmuc.findUnique({
        where: { DanhMucID: data.danhMucChaId },
      });

      if (!parent || parent.IsDeleted) {
        throw new AppError('Danh mục cha không tồn tại', 404);
      }
    }

    const danhMuc = await prisma.danhmuc.update({
      where: { DanhMucID: id },
      data: {
        TenDanhMuc: data.tenDanhMuc,
        MoTa: data.moTa,
        ThuTuHienThi: data.thuTuHienThi,
        DanhMucChaID: data.danhMucChaId,
        TrangThai: data.trangThai,
      },
    });

    return {
      id: danhMuc.DanhMucID,
      tenDanhMuc: danhMuc.TenDanhMuc,
      moTa: danhMuc.MoTa,
      thuTuHienThi: danhMuc.ThuTuHienThi,
      trangThai: danhMuc.TrangThai,
      danhMucChaId: danhMuc.DanhMucChaID,
      updatedAt: danhMuc.UpdatedAt,
    };
  }

  /**
   * Xóa danh mục (xóa mềm)
   */
  async delete(id: number) {
    const existing = await prisma.danhmuc.findUnique({
      where: { DanhMucID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Danh mục không tồn tại', 404);
    }

    // Kiểm tra có danh mục con
    const children = await prisma.danhmuc.findMany({
      where: {
        DanhMucChaID: id,
        IsDeleted: false,
      },
    });

    if (children.length > 0) {
      throw new AppError('Không thể xóa danh mục đang có danh mục con', 400);
    }

    const danhMuc = await prisma.danhmuc.update({
      where: { DanhMucID: id },
      data: {
        IsDeleted: true,
        TrangThai: 'NGUNG_HOAT_DONG',
      },
    });

    return {
      id: danhMuc.DanhMucID,
      message: 'Xóa danh mục thành công',
    };
  }
}