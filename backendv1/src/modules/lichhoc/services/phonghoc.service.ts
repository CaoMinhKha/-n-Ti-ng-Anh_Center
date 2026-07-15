// src/modules/lichhoc/services/phonghoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreatePhongHocDto, UpdatePhongHocDto } from '../dto/index.js';
import { PhongHocQueryDto } from '../dto/phonghoc-query.dto.js';

export class PhongHocService {
  /**
   * Lấy danh sách phòng học
   */
  async getList(query: PhongHocQueryDto) {
    const data = await prisma.phonghoc.findMany({
      orderBy: {
        MaPhong: 'asc',
      },
    });

    return data.map((item) => ({
      id: item.PhongHocID,
      ma_phong: item.MaPhong,
      ten_phong: item.TenPhong,
      suc_chua: item.SucChua,
      toa_nha: item.ToaNha,
      trang_thai: item.TrangThai,
      created_at: item.CreatedAt,
      updated_at: item.UpdatedAt,
    }));
  }

  /**
   * Lấy danh sách phòng học (dropdown)
   */
  async getOptions() {
    const data = await prisma.phonghoc.findMany({
      where: {
        TrangThai: 'TRONG',
      },
      orderBy: {
        MaPhong: 'asc',
      },
    });

    return data.map((item) => ({
      value: item.PhongHocID,
      label: `${item.MaPhong} - ${item.TenPhong} (${item.SucChua} chỗ)`,
    }));
  }

  /**
   * Lấy danh sách trạng thái phòng (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'TRONG', label: 'Trống' },
      { value: 'DANG_SU_DUNG', label: 'Đang sử dụng' },
      { value: 'BAO_TRI', label: 'Bảo trì' },
    ];
  }

  /**
   * Lấy chi tiết phòng học
   */
  async getById(id: number) {
    const phongHoc = await prisma.phonghoc.findUnique({
      where: { PhongHocID: id },
    });

    if (!phongHoc) {
      throw new AppError('Phòng học không tồn tại', 404);
    }

    return {
      id: phongHoc.PhongHocID,
      ma_phong: phongHoc.MaPhong,
      ten_phong: phongHoc.TenPhong,
      suc_chua: phongHoc.SucChua,
      toa_nha: phongHoc.ToaNha,
      trang_thai: phongHoc.TrangThai,
      created_at: phongHoc.CreatedAt,
      updated_at: phongHoc.UpdatedAt,
    };
  }

  /**
   * Lấy phòng học theo mã
   */
  async getByMaPhong(maPhong: string) {
    const phongHoc = await prisma.phonghoc.findUnique({
      where: { MaPhong: maPhong },
    });

    if (!phongHoc) {
      throw new AppError('Phòng học không tồn tại', 404);
    }

    return phongHoc;
  }

  /**
   * Tạo phòng học mới
   */
  async create(data: CreatePhongHocDto) {
    const { MaPhong, TenPhong, SucChua, ToaNha, TrangThai } = data;

    // Kiểm tra mã phòng đã tồn tại
    const existing = await prisma.phonghoc.findUnique({
      where: { MaPhong },
    });

    if (existing) {
      throw new AppError('Mã phòng đã tồn tại', 409);
    }

    const phongHoc = await prisma.phonghoc.create({
      data: {
        MaPhong,
        TenPhong,
        SucChua,
        ToaNha: ToaNha || null,
        TrangThai: TrangThai || 'TRONG',
      },
    });

    return {
      id: phongHoc.PhongHocID,
      ma_phong: phongHoc.MaPhong,
      ten_phong: phongHoc.TenPhong,
      suc_chua: phongHoc.SucChua,
      toa_nha: phongHoc.ToaNha,
      trang_thai: phongHoc.TrangThai,
      created_at: phongHoc.CreatedAt,
    };
  }

  /**
   * Cập nhật phòng học
   */
  async update(id: number, data: UpdatePhongHocDto) {
    const { MaPhong, TenPhong, SucChua, ToaNha, TrangThai } = data;

    const existing = await prisma.phonghoc.findUnique({
      where: { PhongHocID: id },
    });

    if (!existing) {
      throw new AppError('Phòng học không tồn tại', 404);
    }

    // Kiểm tra mã phòng trùng
    if (MaPhong && MaPhong !== existing.MaPhong) {
      const duplicate = await prisma.phonghoc.findUnique({
        where: { MaPhong },
      });
      if (duplicate) {
        throw new AppError('Mã phòng đã tồn tại', 409);
      }
    }

    const phongHoc = await prisma.phonghoc.update({
      where: { PhongHocID: id },
      data: {
        MaPhong,
        TenPhong,
        SucChua,
        ToaNha,
        TrangThai,
      },
    });

    return {
      id: phongHoc.PhongHocID,
      ma_phong: phongHoc.MaPhong,
      ten_phong: phongHoc.TenPhong,
      suc_chua: phongHoc.SucChua,
      toa_nha: phongHoc.ToaNha,
      trang_thai: phongHoc.TrangThai,
      updated_at: phongHoc.UpdatedAt,
    };
  }

  /**
   * Xóa phòng học
   */
  async delete(id: number) {
    const existing = await prisma.phonghoc.findUnique({
      where: { PhongHocID: id },
      include: {
        lichhoc: true,
        buoihoc: true,
      },
    });

    if (!existing) {
      throw new AppError('Phòng học không tồn tại', 404);
    }

    if (existing.lichhoc.length > 0 || existing.buoihoc.length > 0) {
      throw new AppError('Không thể xóa phòng học đang được sử dụng', 400);
    }

    await prisma.phonghoc.delete({
      where: { PhongHocID: id },
    });

    return {
      id: existing.PhongHocID,
      message: 'Xóa phòng học thành công',
    };
  }
}