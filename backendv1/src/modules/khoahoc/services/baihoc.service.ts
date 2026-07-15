// src/modules/khoahoc/services/baihoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  CreateBaiHocDto,
  UpdateBaiHocDto,
  BaiHocQueryDto,
} from '../dto/index.js';

export class BaiHocService {
  /**
   * Lấy danh sách bài học của khóa học
   */
  async getListByKhoaHoc(khoaHocId: number, query: BaiHocQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status = 'ALL',
      sort_by = 'thuTuHienThi',
      order = 'asc',
    } = query;

    const khoaHoc = await prisma.khoahoc.findUnique({
      where: { KhoaHocID: khoaHocId },
    });

    if (!khoaHoc || khoaHoc.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    const where: any = { KhoaHocID: khoaHocId };

    if (search) {
      where.TenBaiHoc = { contains: search };
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const totalItems = await prisma.baihoc.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const sortFieldMap: Record<string, string> = {
      createdAt: 'CreatedAt',
      tenBaiHoc: 'TenBaiHoc',
      thuTuHienThi: 'ThuTuHienThi',
    };
    const sortField = sortFieldMap[sort_by] || 'ThuTuHienThi';
    const orderBy: any = { [sortField]: order };

    const data = await prisma.baihoc.findMany({
      where,
      include: {
        phanbaihoc: {
          where: { TrangThai: 'HIEN' },
          orderBy: { ThuTuHienThi: 'asc' },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      baiHocID: item.BaiHocID,
      tenBaiHoc: item.TenBaiHoc,
      moTa: item.MoTa,
      thuTuHienThi: item.ThuTuHienThi,
      trangThai: item.TrangThai,
      soLuongPhan: item.phanbaihoc.length,
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
   * Lấy chi tiết bài học
   */
  async getById(id: number) {
    const baiHoc = await prisma.baihoc.findUnique({
      where: { BaiHocID: id },
      include: {
        khoahoc: { select: { KhoaHocID: true, TenKhoaHoc: true } },
        phanbaihoc: {
          where: { TrangThai: 'HIEN' },
          orderBy: { ThuTuHienThi: 'asc' },
          include: {
            loaiPhanBaiHoc: { select: { TenDanhMuc: true } },
            baikiemtra: true,
          },
        },
      },
    });

    if (!baiHoc) {
      throw new AppError('Bài học không tồn tại', 404);
    }

    return {
      baiHocID: baiHoc.BaiHocID,
      tenBaiHoc: baiHoc.TenBaiHoc,
      moTa: baiHoc.MoTa,
      thuTuHienThi: baiHoc.ThuTuHienThi,
      trangThai: baiHoc.TrangThai,
      khoaHocID: baiHoc.khoahoc?.KhoaHocID,
      khoaHoc: baiHoc.khoahoc?.TenKhoaHoc,
      soLuongPhan: baiHoc.phanbaihoc.length,
      phanBaiHocs: baiHoc.phanbaihoc.map((phan) => ({
        phanBaiHocID: phan.PhanBaiHocID,
        tenPhanBaiHoc: phan.TenPhanBaiHoc,
        loai: phan.loaiPhanBaiHoc?.TenDanhMuc || null,
        videoUrl: phan.VideoUrl,
        thuTuHienThi: phan.ThuTuHienThi,
        coBaiKiemTra: !!phan.baikiemtra,
      })),
      createdAt: baiHoc.CreatedAt,
      updatedAt: baiHoc.UpdatedAt,
    };
  }

/**
 * Tạo bài học mới
 */
async create(khoaHocId: number, data: CreateBaiHocDto) {
  const { tenBaiHoc, moTa, thuTuHienThi, trangThai } = data;

  // Kiểm tra khóa học tồn tại
  const khoaHoc = await prisma.khoahoc.findUnique({
    where: { KhoaHocID: khoaHocId },
  });

  if (!khoaHoc || khoaHoc.IsDeleted) {
    throw new AppError('Khóa học không tồn tại', 404);
  }

  // Kiểm tra tên bài học đã tồn tại trong khóa học
  const existing = await prisma.baihoc.findFirst({
    where: {
      KhoaHocID: khoaHocId,
      TenBaiHoc: tenBaiHoc,
    },
  });

  if (existing) {
    throw new AppError('Tên bài học đã tồn tại trong khóa học này', 409);
  }

  //  Lấy thứ tự hiển thị lớn nhất + 1
  let thuTu = thuTuHienThi;
  if (thuTu === undefined) {
    const maxOrder = await prisma.baihoc.aggregate({
      where: { KhoaHocID: khoaHocId },
      _max: { ThuTuHienThi: true },
    });
    thuTu = (maxOrder._max.ThuTuHienThi || 0) + 1;
  }

  const baiHoc = await prisma.baihoc.create({
    data: {
      KhoaHocID: khoaHocId,
      TenBaiHoc: tenBaiHoc,
      MoTa: moTa || null,
      ThuTuHienThi: thuTu,
      TrangThai: trangThai || 'HIEN',
    },
  });

  return {
    baiHocID: baiHoc.BaiHocID,
    tenBaiHoc: baiHoc.TenBaiHoc,
    moTa: baiHoc.MoTa,
    thuTuHienThi: baiHoc.ThuTuHienThi,
    trangThai: baiHoc.TrangThai,
    createdAt: baiHoc.CreatedAt,
  };
}

  /**
   * Cập nhật bài học
   */
  async update(id: number, data: UpdateBaiHocDto) {
    const { tenBaiHoc, moTa, thuTuHienThi, trangThai } = data;

    const existing = await prisma.baihoc.findUnique({
      where: { BaiHocID: id },
    });

    if (!existing) {
      throw new AppError('Bài học không tồn tại', 404);
    }

    if (tenBaiHoc) {
      const duplicate = await prisma.baihoc.findFirst({
        where: {
          KhoaHocID: existing.KhoaHocID,
          TenBaiHoc: tenBaiHoc,
          BaiHocID: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError('Tên bài học đã tồn tại trong khóa học này', 409);
      }
    }

    const baiHoc = await prisma.baihoc.update({
      where: { BaiHocID: id },
      data: {
        TenBaiHoc: tenBaiHoc,
        MoTa: moTa,
        ThuTuHienThi: thuTuHienThi,
        TrangThai: trangThai,
      },
    });

    return {
      baiHocID: baiHoc.BaiHocID,
      tenBaiHoc: baiHoc.TenBaiHoc,
      moTa: baiHoc.MoTa,
      thuTuHienThi: baiHoc.ThuTuHienThi,
      trangThai: baiHoc.TrangThai,
      updatedAt: baiHoc.UpdatedAt,
    };
  }

  /**
   * Cập nhật thứ tự bài học (Bulk update)
   */
  async updateOrder(khoaHocId: number, orders: { baiHocID: number; thuTuHienThi: number }[]) {
    const khoaHoc = await prisma.khoahoc.findUnique({
      where: { KhoaHocID: khoaHocId },
    });

    if (!khoaHoc || khoaHoc.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    const baiHocIds = orders.map((item) => item.baiHocID);
    const existingBaiHocs = await prisma.baihoc.findMany({
      where: { BaiHocID: { in: baiHocIds }, KhoaHocID: khoaHocId },
      select: { BaiHocID: true },
    });

    const existingIds = existingBaiHocs.map((item) => item.BaiHocID);
    const invalidIds = baiHocIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      throw new AppError(`Bài học không hợp lệ: ${invalidIds.join(', ')}`, 400);
    }

    let updatedCount = 0;
    for (const order of orders) {
      await prisma.baihoc.update({
        where: { BaiHocID: order.baiHocID },
        data: { ThuTuHienThi: order.thuTuHienThi },
      });
      updatedCount++;
    }

    return { message: 'Cập nhật thứ tự bài học thành công', updated: updatedCount };
  }

  /**
   * Xóa bài học
   */
  async delete(id: number) {
    const existing = await prisma.baihoc.findUnique({
      where: { BaiHocID: id },
      include: {
        phanbaihoc: {
          where: { TrangThai: 'HIEN' },
        },
      },
    });

    if (!existing) {
      throw new AppError('Bài học không tồn tại', 404);
    }

    if (existing.phanbaihoc.length > 0) {
      throw new AppError('Không thể xóa bài học đang có phần bài học', 400);
    }

    await prisma.baihoc.delete({ where: { BaiHocID: id } });

    return { baiHocID: existing.BaiHocID, message: 'Xóa bài học thành công' };
  }
}