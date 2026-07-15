// src/modules/khoahoc/services/phanbaihoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  CreatePhanBaiHocDto,
  UpdatePhanBaiHocDto,
} from '../dto/index.js';

export class PhanBaiHocService {
  /**
   * Lấy danh sách phần bài học của bài học
   */
  async getListByBaiHoc(baiHocId: number) {
    const baiHoc = await prisma.baihoc.findUnique({
      where: { BaiHocID: baiHocId },
    });

    if (!baiHoc) {
      throw new AppError('Bài học không tồn tại', 404);
    }

    const data = await prisma.phanbaihoc.findMany({
      where: { BaiHocID: baiHocId, TrangThai: 'HIEN' },
      include: {
        loaiPhanBaiHoc: { select: { DanhMucID: true, TenDanhMuc: true } },
        baikiemtra: true,
      },
      orderBy: { ThuTuHienThi: 'asc' },
    });

    return data.map((item) => ({
      phanBaiHocID: item.PhanBaiHocID,
      tenPhanBaiHoc: item.TenPhanBaiHoc,
      tieuDe: item.TieuDe,
      videoUrl: item.VideoUrl,
      loai: item.loaiPhanBaiHoc?.TenDanhMuc || null,
      loaiID: item.LoaiPhanBaiHocID,
      thuTuHienThi: item.ThuTuHienThi,
      trangThai: item.TrangThai,
      coBaiKiemTra: item.baikiemtra && item.baikiemtra.length > 0,
      baiKiemTraID: item.baikiemtra && item.baikiemtra.length > 0
        ? item.baikiemtra[0].BaiKiemTraID
        : null,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
    }));
  }

  /**
   * Lấy chi tiết phần bài học
   */
  async getById(id: number) {
    const phanBaiHoc = await prisma.phanbaihoc.findUnique({
      where: { PhanBaiHocID: id },
      include: {
        baihoc: { select: { BaiHocID: true, TenBaiHoc: true } },
        loaiPhanBaiHoc: { select: { TenDanhMuc: true } },
        baikiemtra: true,
      },
    });

    if (!phanBaiHoc) {
      throw new AppError('Phần bài học không tồn tại', 404);
    }

    return {
      phanBaiHocID: phanBaiHoc.PhanBaiHocID,
      tenPhanBaiHoc: phanBaiHoc.TenPhanBaiHoc,
      tieuDe: phanBaiHoc.TieuDe,
      videoUrl: phanBaiHoc.VideoUrl,
      loai: phanBaiHoc.loaiPhanBaiHoc?.TenDanhMuc || null,
      loaiID: phanBaiHoc.LoaiPhanBaiHocID,
      thuTuHienThi: phanBaiHoc.ThuTuHienThi,
      trangThai: phanBaiHoc.TrangThai,
      baiHocID: phanBaiHoc.BaiHocID,
      baiHoc: phanBaiHoc.baihoc?.TenBaiHoc,
      coBaiKiemTra: phanBaiHoc.baikiemtra && phanBaiHoc.baikiemtra.length > 0,
      baiKiemTra: phanBaiHoc.baikiemtra && phanBaiHoc.baikiemtra.length > 0
        ? phanBaiHoc.baikiemtra[0]
        : null,
      createdAt: phanBaiHoc.CreatedAt,
      updatedAt: phanBaiHoc.UpdatedAt,
    };
  }

/**
 * Tạo phần bài học mới
 */
async create(baiHocId: number, data: CreatePhanBaiHocDto) {
  const { tenPhanBaiHoc, loaiPhanBaiHocID, tieuDe, videoUrl, thuTuHienThi, trangThai } = data;

  // Kiểm tra bài học tồn tại
  const baiHoc = await prisma.baihoc.findUnique({
    where: { BaiHocID: baiHocId },
  });

  if (!baiHoc) {
    throw new AppError('Bài học không tồn tại', 404);
  }

  // Kiểm tra loại phần bài học tồn tại
  const loai = await prisma.danhmuc.findUnique({
    where: { DanhMucID: loaiPhanBaiHocID },
  });
  if (!loai || loai.IsDeleted) {
    throw new AppError('Loại phần bài học không tồn tại', 404);
  }

  //  Lấy thứ tự hiển thị lớn nhất + 1
  let thuTu = thuTuHienThi;
  if (thuTu === undefined) {
    const maxOrder = await prisma.phanbaihoc.aggregate({
      where: { BaiHocID: baiHocId },
      _max: { ThuTuHienThi: true },
    });
    thuTu = (maxOrder._max.ThuTuHienThi || 0) + 1;
  }

  const phanBaiHoc = await prisma.phanbaihoc.create({
    data: {
      BaiHocID: baiHocId,
      TenPhanBaiHoc: tenPhanBaiHoc,
      LoaiPhanBaiHocID: loaiPhanBaiHocID,
      TieuDe: tieuDe ?? null,
      VideoUrl: videoUrl ?? null,
      ThuTuHienThi: thuTu,
      TrangThai: trangThai || 'HIEN',
    },
  });

  return {
    phanBaiHocID: phanBaiHoc.PhanBaiHocID,
    tenPhanBaiHoc: phanBaiHoc.TenPhanBaiHoc,
    tieuDe: phanBaiHoc.TieuDe,
    videoUrl: phanBaiHoc.VideoUrl,
    loaiID: phanBaiHoc.LoaiPhanBaiHocID,
    thuTuHienThi: phanBaiHoc.ThuTuHienThi,
    trangThai: phanBaiHoc.TrangThai,
    createdAt: phanBaiHoc.CreatedAt,
  };
}

  /**
   * Cập nhật phần bài học
   */
  async update(id: number, data: UpdatePhanBaiHocDto) {
    const { tenPhanBaiHoc, loaiPhanBaiHocID, tieuDe, videoUrl, thuTuHienThi, trangThai } = data;

    const existing = await prisma.phanbaihoc.findUnique({
      where: { PhanBaiHocID: id },
    });

    if (!existing) {
      throw new AppError('Phần bài học không tồn tại', 404);
    }

    if (loaiPhanBaiHocID) {
      const loai = await prisma.danhmuc.findUnique({
        where: { DanhMucID: loaiPhanBaiHocID },
      });
      if (!loai || loai.IsDeleted) {
        throw new AppError('Loại phần bài học không tồn tại', 404);
      }
    }

    const phanBaiHoc = await prisma.phanbaihoc.update({
      where: { PhanBaiHocID: id },
      data: {
        TenPhanBaiHoc: tenPhanBaiHoc,
        LoaiPhanBaiHocID: loaiPhanBaiHocID,
        TieuDe: tieuDe ?? null,
        VideoUrl: videoUrl ?? null,
        ThuTuHienThi: thuTuHienThi,
        TrangThai: trangThai,
      },
    });

    return {
      phanBaiHocID: phanBaiHoc.PhanBaiHocID,
      tenPhanBaiHoc: phanBaiHoc.TenPhanBaiHoc,
      tieuDe: phanBaiHoc.TieuDe,
      videoUrl: phanBaiHoc.VideoUrl,
      loaiID: phanBaiHoc.LoaiPhanBaiHocID,
      thuTuHienThi: phanBaiHoc.ThuTuHienThi,
      trangThai: phanBaiHoc.TrangThai,
      updatedAt: phanBaiHoc.UpdatedAt,
    };
  }

  /**
   * Cập nhật thứ tự phần bài học (Bulk update)
   */
  async updateOrder(baiHocId: number, orders: { phanBaiHocID: number; thuTuHienThi: number }[]) {
    const baiHoc = await prisma.baihoc.findUnique({
      where: { BaiHocID: baiHocId },
    });

    if (!baiHoc) {
      throw new AppError('Bài học không tồn tại', 404);
    }

    const phanBaiHocIds = orders.map((item) => item.phanBaiHocID);
    const existingPhanBaiHocs = await prisma.phanbaihoc.findMany({
      where: { PhanBaiHocID: { in: phanBaiHocIds }, BaiHocID: baiHocId },
      select: { PhanBaiHocID: true },
    });

    const existingIds = existingPhanBaiHocs.map((item) => item.PhanBaiHocID);
    const invalidIds = phanBaiHocIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      throw new AppError(`Phần bài học không hợp lệ: ${invalidIds.join(', ')}`, 400);
    }

    let updatedCount = 0;
    for (const order of orders) {
      await prisma.phanbaihoc.update({
        where: { PhanBaiHocID: order.phanBaiHocID },
        data: { ThuTuHienThi: order.thuTuHienThi },
      });
      updatedCount++;
    }

    return { message: 'Cập nhật thứ tự phần bài học thành công', updated: updatedCount };
  }

  /**
   * Xóa phần bài học
   */
  async delete(id: number) {
    const existing = await prisma.phanbaihoc.findUnique({
      where: { PhanBaiHocID: id },
      include: {
        baikiemtra: true,
        phanbaihocCauhois: true,
      },
    });

    if (!existing) {
      throw new AppError('Phần bài học không tồn tại', 404);
    }

    if (existing.baikiemtra.length > 0) {
      throw new AppError('Không thể xóa phần bài học đang có bài kiểm tra', 400);
    }

    if (existing.phanbaihocCauhois.length > 0) {
      throw new AppError('Không thể xóa phần bài học đang có câu hỏi', 400);
    }

    await prisma.phanbaihoc.delete({ where: { PhanBaiHocID: id } });

    return { phanBaiHocID: existing.PhanBaiHocID, message: 'Xóa phần bài học thành công' };
  }
  /**
 * Lấy danh sách loại phần bài học (dropdown)
 * Lấy các danh mục con của "Nội dung học"
 */
async getLoaiPhanBaiHocOptions() {
  // Tìm danh mục "Nội dung học"
  const noiDungHoc = await prisma.danhmuc.findFirst({
    where: {
      TenDanhMuc: 'Nội dung học',
      IsDeleted: false,
    },
  });

  if (!noiDungHoc) {
    return [];
  }

  // Lấy các danh mục con của "Nội dung học"
  const loaiList = await prisma.danhmuc.findMany({
    where: {
      DanhMucChaID: noiDungHoc.DanhMucID,
      IsDeleted: false,
      TrangThai: 'HOAT_DONG',
    },
    orderBy: {
      ThuTuHienThi: 'asc',
    },
  });

  return loaiList.map((item) => ({
    value: item.DanhMucID,
    label: item.TenDanhMuc,
  }));
}
}