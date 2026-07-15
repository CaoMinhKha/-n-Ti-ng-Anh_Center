// src/modules/lichhoc/services/cahoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateCaHocDto, UpdateCaHocDto } from '../dto/index.js';

export class CaHocService {
  /**
   * Lấy danh sách ca học
   */
  async getList() {
    const data = await prisma.cahoc.findMany({
      orderBy: {
        GioBatDau: 'asc',
      },
    });

    return data.map((item) => ({
      id: item.CaHocID,
      ma_ca: item.MaCa,
      ten_ca: item.TenCa,
      gio_bat_dau: item.GioBatDau,
      gio_ket_thuc: item.GioKetThuc,
      trang_thai: item.TrangThai,
      created_at: item.CreatedAt,
      updated_at: item.UpdatedAt,
    }));
  }

  /**
   * Lấy danh sách ca học (dropdown)
   */
  async getOptions() {
    const data = await prisma.cahoc.findMany({
      where: {
        TrangThai: 'HOAT_DONG',
      },
      orderBy: {
        GioBatDau: 'asc',
      },
    });

    return data.map((item) => ({
      value: item.CaHocID,
      label: `${item.TenCa} (${item.GioBatDau.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} - ${item.GioKetThuc.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })})`,
    }));
  }

  /**
   * Lấy chi tiết ca học
   */
  async getById(id: number) {
    const caHoc = await prisma.cahoc.findUnique({
      where: { CaHocID: id },
    });

    if (!caHoc) {
      throw new AppError('Ca học không tồn tại', 404);
    }

    return {
      id: caHoc.CaHocID,
      ma_ca: caHoc.MaCa,
      ten_ca: caHoc.TenCa,
      gio_bat_dau: caHoc.GioBatDau,
      gio_ket_thuc: caHoc.GioKetThuc,
      trang_thai: caHoc.TrangThai,
      created_at: caHoc.CreatedAt,
      updated_at: caHoc.UpdatedAt,
    };
  }

  /**
   * Lấy ca học theo mã
   */
  async getByMaCa(maCa: string) {
    const caHoc = await prisma.cahoc.findUnique({
      where: { MaCa: maCa },
    });

    if (!caHoc) {
      throw new AppError('Ca học không tồn tại', 404);
    }

    return caHoc;
  }

  /**
   * Tạo ca học mới
   */
  async create(data: CreateCaHocDto) {
    const { MaCa, TenCa, GioBatDau, GioKetThuc, TrangThai } = data;

    // Kiểm tra mã ca đã tồn tại
    const existing = await prisma.cahoc.findUnique({
      where: { MaCa },
    });

    if (existing) {
      throw new AppError('Mã ca đã tồn tại', 409);
    }

    // Parse time string to Date
    const [hourStart, minuteStart] = GioBatDau.split(':').map(Number);
    const [hourEnd, minuteEnd] = GioKetThuc.split(':').map(Number);

    const gioBatDau = new Date();
    gioBatDau.setHours(hourStart, minuteStart, 0, 0);

    const gioKetThuc = new Date();
    gioKetThuc.setHours(hourEnd, minuteEnd, 0, 0);

    const caHoc = await prisma.cahoc.create({
      data: {
        MaCa,
        TenCa,
        GioBatDau: gioBatDau,
        GioKetThuc: gioKetThuc,
        TrangThai: TrangThai || 'HOAT_DONG',
      },
    });

    return {
      id: caHoc.CaHocID,
      ma_ca: caHoc.MaCa,
      ten_ca: caHoc.TenCa,
      gio_bat_dau: caHoc.GioBatDau,
      gio_ket_thuc: caHoc.GioKetThuc,
      trang_thai: caHoc.TrangThai,
      created_at: caHoc.CreatedAt,
    };
  }

  /**
   * Cập nhật ca học
   */
  async update(id: number, data: UpdateCaHocDto) {
    const { MaCa, TenCa, GioBatDau, GioKetThuc, TrangThai } = data;

    const existing = await prisma.cahoc.findUnique({
      where: { CaHocID: id },
    });

    if (!existing) {
      throw new AppError('Ca học không tồn tại', 404);
    }

    // Kiểm tra mã ca trùng
    if (MaCa && MaCa !== existing.MaCa) {
      const duplicate = await prisma.cahoc.findUnique({
        where: { MaCa },
      });
      if (duplicate) {
        throw new AppError('Mã ca đã tồn tại', 409);
      }
    }

    // Parse time
    let gioBatDauDate = existing.GioBatDau;
    let gioKetThucDate = existing.GioKetThuc;

    if (GioBatDau) {
      const [hour, minute] = GioBatDau.split(':').map(Number);
      gioBatDauDate = new Date();
      gioBatDauDate.setHours(hour, minute, 0, 0);
    }

    if (GioKetThuc) {
      const [hour, minute] = GioKetThuc.split(':').map(Number);
      gioKetThucDate = new Date();
      gioKetThucDate.setHours(hour, minute, 0, 0);
    }

    const caHoc = await prisma.cahoc.update({
      where: { CaHocID: id },
      data: {
        MaCa,
        TenCa,
        GioBatDau: gioBatDauDate,
        GioKetThuc: gioKetThucDate,
        TrangThai,
      },
    });

    return {
      id: caHoc.CaHocID,
      ma_ca: caHoc.MaCa,
      ten_ca: caHoc.TenCa,
      gio_bat_dau: caHoc.GioBatDau,
      gio_ket_thuc: caHoc.GioKetThuc,
      trang_thai: caHoc.TrangThai,
      updated_at: caHoc.UpdatedAt,
    };
  }

  /**
   * Xóa ca học
   */
  async delete(id: number) {
    const existing = await prisma.cahoc.findUnique({
      where: { CaHocID: id },
      include: {
        lichhoc: true,
        buoihoc: true,
      },
    });

    if (!existing) {
      throw new AppError('Ca học không tồn tại', 404);
    }

    if (existing.lichhoc.length > 0 || existing.buoihoc.length > 0) {
      throw new AppError('Không thể xóa ca học đang được sử dụng', 400);
    }

    await prisma.cahoc.delete({
      where: { CaHocID: id },
    });

    return {
      id: existing.CaHocID,
      message: 'Xóa ca học thành công',
    };
  }
}