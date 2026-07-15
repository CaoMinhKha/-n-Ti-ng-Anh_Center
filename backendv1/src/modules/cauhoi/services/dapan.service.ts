// src/modules/cauhoi/services/dapan.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateDapAnDto, UpdateDapAnDto } from '../dto/index.js';

export class DapAnService {
  /**
   * Lấy danh sách đáp án của câu hỏi
   */
  async getListByCauHoi(cauHoiId: number) {
    const cauHoi = await prisma.cauhoi.findUnique({
      where: { CauHoiID: cauHoiId },
    });

    if (!cauHoi) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    const dapAns = await prisma.dapan.findMany({
      where: { CauHoiID: cauHoiId },
      orderBy: {
        ThuTuHienThi: 'asc',
      },
    });

    return dapAns.map((item) => ({
      dapAnID: item.DapAnID,
      cauHoiID: item.CauHoiID,
      noiDungText: item.NoiDungText,
      noiDungUrl: item.NoiDungUrl,
      laDapAnDung: item.LaDapAnDung,
      thuTuHienThi: item.ThuTuHienThi,
      giaTriKhop: item.GiaTriKhop,
      createdAt: item.CreatedAt,
      updatedAt: item.UpdatedAt,
    }));
  }

  /**
   * Tạo đáp án mới
   */
  async create(cauHoiId: number, data: CreateDapAnDto) {
    const { noiDungText, noiDungUrl, laDapAnDung, thuTuHienThi, giaTriKhop } = data;

    const cauHoi = await prisma.cauhoi.findUnique({
      where: { CauHoiID: cauHoiId },
    });

    if (!cauHoi) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    const TRAC_NGHIEM_TYPES = [
      'TRAC_NGHIEM_MOT_DAP_AN',
      'DUNG_SAI',
      'TRAC_NGHIEM_NHIEU_DAP_AN',
      'DIEN_VAO_CHO_TRONG',
      'NOI_CAP',
      'SAP_XEP',
      'PHAN_LOAI',
    ];

    if (!TRAC_NGHIEM_TYPES.includes(cauHoi.LoaiCauHoi)) {
      throw new AppError(`Câu hỏi loại ${cauHoi.LoaiCauHoi} không có đáp án`, 400);
    }

    let thuTu = thuTuHienThi;
    if (thuTu === undefined) {
      const maxOrder = await prisma.dapan.aggregate({
        where: { CauHoiID: cauHoiId },
        _max: { ThuTuHienThi: true },
      });
      thuTu = (maxOrder._max.ThuTuHienThi || 0) + 1;
    }

    const dapAn = await prisma.dapan.create({
      data: {
        CauHoiID: cauHoiId,
        NoiDungText: noiDungText,
        NoiDungUrl: noiDungUrl || null,
        LaDapAnDung: laDapAnDung || false,
        ThuTuHienThi: thuTu,
        GiaTriKhop: giaTriKhop || null,
      },
    });

    return {
      dapAnID: dapAn.DapAnID,
      cauHoiID: dapAn.CauHoiID,
      noiDungText: dapAn.NoiDungText,
      noiDungUrl: dapAn.NoiDungUrl,
      laDapAnDung: dapAn.LaDapAnDung,
      thuTuHienThi: dapAn.ThuTuHienThi,
      giaTriKhop: dapAn.GiaTriKhop,
      createdAt: dapAn.CreatedAt,
    };
  }

  /**
   * Cập nhật đáp án
   */
  async update(id: number, data: UpdateDapAnDto) {
    const { noiDungText, noiDungUrl, laDapAnDung, thuTuHienThi, giaTriKhop } = data;

    const existing = await prisma.dapan.findUnique({
      where: { DapAnID: id },
    });

    if (!existing) {
      throw new AppError('Đáp án không tồn tại', 404);
    }

    const dapAn = await prisma.dapan.update({
      where: { DapAnID: id },
      data: {
        NoiDungText: noiDungText,
        NoiDungUrl: noiDungUrl === undefined ? undefined : (noiDungUrl || null),
        LaDapAnDung: laDapAnDung,
        ThuTuHienThi: thuTuHienThi,
        GiaTriKhop: giaTriKhop === undefined ? undefined : (giaTriKhop || null),
      },
    });

    return {
      dapAnID: dapAn.DapAnID,
      cauHoiID: dapAn.CauHoiID,
      noiDungText: dapAn.NoiDungText,
      noiDungUrl: dapAn.NoiDungUrl,
      laDapAnDung: dapAn.LaDapAnDung,
      thuTuHienThi: dapAn.ThuTuHienThi,
      giaTriKhop: dapAn.GiaTriKhop,
      updatedAt: dapAn.UpdatedAt,
    };
  }

  /**
   * Xóa đáp án
   */
  async delete(id: number) {
    const existing = await prisma.dapan.findUnique({
      where: { DapAnID: id },
    });

    if (!existing) {
      throw new AppError('Đáp án không tồn tại', 404);
    }

    await prisma.dapan.delete({
      where: { DapAnID: id },
    });

    return {
      dapAnID: existing.DapAnID,
      message: 'Xóa đáp án thành công',
    };
  }
}