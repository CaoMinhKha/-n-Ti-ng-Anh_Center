// src/modules/khoahoc/services/baikiemtra.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateBaiKiemTraDto, UpdateBaiKiemTraDto } from '../dto/index.js';

export class BaiKiemTraService {
  /**
   * Lấy chi tiết bài kiểm tra
   */
  async getById(id: number) {
    const baiKiemTra = await prisma.baikiemtra.findUnique({
      where: { BaiKiemTraID: id },
      include: {
        phanbaihoc: { select: { PhanBaiHocID: true, TenPhanBaiHoc: true } },
      },
    });

    if (!baiKiemTra) {
      throw new AppError('Bài kiểm tra không tồn tại', 404);
    }

    return {
      baiKiemTraID: baiKiemTra.BaiKiemTraID,
      tenBaiKiemTra: baiKiemTra.TenBaiKiemTra,
      phanBaiHocID: baiKiemTra.PhanBaiHocID,
      phanBaiHoc: baiKiemTra.phanbaihoc?.TenPhanBaiHoc,
      thoiGianBatDau: baiKiemTra.ThoiGianBatDau,
      thoiGianLamBai: baiKiemTra.ThoiGianLamBai,
      diemDat: baiKiemTra.DiemDat,
      diemMax: baiKiemTra.DiemMax,
      trangThai: baiKiemTra.TrangThai,
      createdAt: baiKiemTra.CreatedAt,
      updatedAt: baiKiemTra.UpdatedAt,
    };
  }

  /**
   * Tạo bài kiểm tra mới
   */
  async create(phanBaiHocId: number, data: CreateBaiKiemTraDto) {
    const { tenBaiKiemTra, thoiGianBatDau, thoiGianLamBai, diemDat, diemMax, trangThai } = data;

    const phanBaiHoc = await prisma.phanbaihoc.findUnique({
      where: { PhanBaiHocID: phanBaiHocId },
    });

    if (!phanBaiHoc) {
      throw new AppError('Phần bài học không tồn tại', 404);
    }

    const existing = await prisma.baikiemtra.findFirst({
      where: { PhanBaiHocID: phanBaiHocId },
    });

    if (existing) {
      throw new AppError('Phần bài học này đã có bài kiểm tra', 409);
    }

    const baiKiemTra = await prisma.baikiemtra.create({
      data: {
        PhanBaiHocID: phanBaiHocId,
        TenBaiKiemTra: tenBaiKiemTra,
        ThoiGianBatDau: thoiGianBatDau || null,
        ThoiGianLamBai: thoiGianLamBai,
        DiemDat: diemDat || 0,
        DiemMax: diemMax || 100,
        TrangThai: trangThai || 'HIEN',
      },
    });

    return {
      baiKiemTraID: baiKiemTra.BaiKiemTraID,
      tenBaiKiemTra: baiKiemTra.TenBaiKiemTra,
      thoiGianBatDau: baiKiemTra.ThoiGianBatDau,
      thoiGianLamBai: baiKiemTra.ThoiGianLamBai,
      diemDat: baiKiemTra.DiemDat,
      diemMax: baiKiemTra.DiemMax,
      trangThai: baiKiemTra.TrangThai,
      createdAt: baiKiemTra.CreatedAt,
    };
  }

  /**
   * Cập nhật bài kiểm tra
   */
  async update(id: number, data: UpdateBaiKiemTraDto) {
    const { tenBaiKiemTra, thoiGianBatDau, thoiGianLamBai, diemDat, diemMax, trangThai } = data;

    const existing = await prisma.baikiemtra.findUnique({
      where: { BaiKiemTraID: id },
    });

    if (!existing) {
      throw new AppError('Bài kiểm tra không tồn tại', 404);
    }

    const baiKiemTra = await prisma.baikiemtra.update({
      where: { BaiKiemTraID: id },
      data: {
        TenBaiKiemTra: tenBaiKiemTra,
        ThoiGianBatDau: thoiGianBatDau,
        ThoiGianLamBai: thoiGianLamBai,
        DiemDat: diemDat,
        DiemMax: diemMax,
        TrangThai: trangThai,
      },
    });

    return {
      baiKiemTraID: baiKiemTra.BaiKiemTraID,
      tenBaiKiemTra: baiKiemTra.TenBaiKiemTra,
      thoiGianBatDau: baiKiemTra.ThoiGianBatDau,
      thoiGianLamBai: baiKiemTra.ThoiGianLamBai,
      diemDat: baiKiemTra.DiemDat,
      diemMax: baiKiemTra.DiemMax,
      trangThai: baiKiemTra.TrangThai,
      updatedAt: baiKiemTra.UpdatedAt,
    };
  }

  /**
   * Xóa bài kiểm tra
   */
  async delete(id: number) {
    const existing = await prisma.baikiemtra.findUnique({
      where: { BaiKiemTraID: id },
      include: {
        bailam: true,
        baikiemtra_cauhoi: true,
      },
    });

    if (!existing) {
      throw new AppError('Bài kiểm tra không tồn tại', 404);
    }

    if (existing.bailam.length > 0) {
      throw new AppError('Không thể xóa bài kiểm tra đã có bài làm', 400);
    }

    if (existing.baikiemtra_cauhoi.length > 0) {
      throw new AppError('Không thể xóa bài kiểm tra đã có câu hỏi', 400);
    }

    await prisma.baikiemtra.delete({ where: { BaiKiemTraID: id } });

    return { baiKiemTraID: existing.BaiKiemTraID, message: 'Xóa bài kiểm tra thành công' };
  }

  /**
 * Lấy danh sách câu hỏi của bài kiểm tra
 */
async getCauHoiList(baiKiemTraId: number) {
  const baiKiemTra = await prisma.baikiemtra.findUnique({
    where: { BaiKiemTraID: baiKiemTraId },
  });

  if (!baiKiemTra) {
    throw new AppError('Bài kiểm tra không tồn tại', 404);
  }

  const data = await prisma.baikiemtra_cauhoi.findMany({
    where: {
      BaiKiemTraID: baiKiemTraId,
    },
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
    },
    orderBy: {
      ThuTuHienThi: 'asc',
    },
  });

  return data.map((item) => ({
    baiKiemTraID: item.BaiKiemTraID,
    cauHoiID: item.CauHoiID,
    thuTuHienThi: item.ThuTuHienThi,
    cauHoi: item.cauhoi ? {
      cauHoiID: item.cauhoi.CauHoiID,
      loaiCauHoi: item.cauhoi.LoaiCauHoi,
      noiDungText: item.cauhoi.NoiDungText,
      noiDungUrl: item.cauhoi.NoiDungUrl,
      dapAn: item.cauhoi.dapan.map((d) => ({
        dapAnID: d.DapAnID,
        noiDungText: d.NoiDungText,
        laDapAnDung: d.LaDapAnDung,
        thuTuHienThi: d.ThuTuHienThi,
      })),
    } : null,
  }));
}

/**
 * Thêm câu hỏi vào bài kiểm tra
 */
async addCauHoi(baiKiemTraId: number, cauHoiId: number, thuTuHienThi?: number) {
  // Kiểm tra bài kiểm tra tồn tại
  const baiKiemTra = await prisma.baikiemtra.findUnique({
    where: { BaiKiemTraID: baiKiemTraId },
  });

  if (!baiKiemTra) {
    throw new AppError('Bài kiểm tra không tồn tại', 404);
  }

  // Kiểm tra câu hỏi tồn tại
  const cauHoi = await prisma.cauhoi.findUnique({
    where: { CauHoiID: cauHoiId },
  });

  if (!cauHoi) {
    throw new AppError('Câu hỏi không tồn tại', 404);
  }

  // Kiểm tra đã tồn tại trong bài kiểm tra chưa
  const existing = await prisma.baikiemtra_cauhoi.findFirst({
    where: {
      BaiKiemTraID: baiKiemTraId,
      CauHoiID: cauHoiId,
    },
  });

  if (existing) {
    throw new AppError('Câu hỏi đã có trong bài kiểm tra này', 409);
  }

  // Tự động tính thứ tự
  let thuTu = thuTuHienThi;
  if (thuTu === undefined) {
    const maxOrder = await prisma.baikiemtra_cauhoi.aggregate({
      where: { BaiKiemTraID: baiKiemTraId },
      _max: { ThuTuHienThi: true },
    });
    thuTu = (maxOrder._max.ThuTuHienThi || 0) + 1;
  }

  const result = await prisma.baikiemtra_cauhoi.create({
    data: {
      BaiKiemTraID: baiKiemTraId,
      CauHoiID: cauHoiId,
      ThuTuHienThi: thuTu,
    },
    include: {
      cauhoi: {
        include: {
          dapan: true,
        },
      },
    },
  });

  return {
    baiKiemTraID: result.BaiKiemTraID,
    cauHoiID: result.CauHoiID,
    thuTuHienThi: result.ThuTuHienThi,
    cauHoi: result.cauhoi ? {
      cauHoiID: result.cauhoi.CauHoiID,
      loaiCauHoi: result.cauhoi.LoaiCauHoi,
      noiDungText: result.cauhoi.NoiDungText,
      dapAn: result.cauhoi.dapan.map((d) => ({
        dapAnID: d.DapAnID,
        noiDungText: d.NoiDungText,
        laDapAnDung: d.LaDapAnDung,
      })),
    } : null,
  };
}

/**
 * Xóa câu hỏi khỏi bài kiểm tra
 */
async removeCauHoi(baiKiemTraId: number, cauHoiId: number) {
  const existing = await prisma.baikiemtra_cauhoi.findFirst({
    where: {
      BaiKiemTraID: baiKiemTraId,
      CauHoiID: cauHoiId,
    },
  });

  if (!existing) {
    throw new AppError('Câu hỏi không tồn tại trong bài kiểm tra này', 404);
  }

  await prisma.baikiemtra_cauhoi.delete({
    where: {
      BaiKiemTraID_CauHoiID: {
        BaiKiemTraID: baiKiemTraId,
        CauHoiID: cauHoiId,
      },
    },
  });

  return {
    message: 'Xóa câu hỏi khỏi bài kiểm tra thành công',
    baiKiemTraID: baiKiemTraId,
    cauHoiID: cauHoiId,
  };
}

/**
 * Cập nhật thứ tự câu hỏi trong bài kiểm tra
 */
async updateCauHoiOrder(baiKiemTraId: number, cauHoiId: number, thuTuHienThi: number) {
  const existing = await prisma.baikiemtra_cauhoi.findFirst({
    where: {
      BaiKiemTraID: baiKiemTraId,
      CauHoiID: cauHoiId,
    },
  });

  if (!existing) {
    throw new AppError('Câu hỏi không tồn tại trong bài kiểm tra này', 404);
  }

  const result = await prisma.baikiemtra_cauhoi.update({
    where: {
      BaiKiemTraID_CauHoiID: {
        BaiKiemTraID: baiKiemTraId,
        CauHoiID: cauHoiId,
      },
    },
    data: {
      ThuTuHienThi: thuTuHienThi,
    },
  });

  return {
    baiKiemTraID: result.BaiKiemTraID,
    cauHoiID: result.CauHoiID,
    thuTuHienThi: result.ThuTuHienThi,
    message: 'Cập nhật thứ tự thành công',
  };
}

/**
 * Lấy danh sách câu hỏi có thể thêm vào bài kiểm tra
 * (Câu hỏi chưa thuộc bài kiểm tra này)
 */
async getAvailableCauHois(baiKiemTraId: number) {
  const baiKiemTra = await prisma.baikiemtra.findUnique({
    where: { BaiKiemTraID: baiKiemTraId },
  });

  if (!baiKiemTra) {
    throw new AppError('Bài kiểm tra không tồn tại', 404);
  }

  // Lấy câu hỏi đã có trong bài kiểm tra
  const existing = await prisma.baikiemtra_cauhoi.findMany({
    where: { BaiKiemTraID: baiKiemTraId },
    select: { CauHoiID: true },
  });

  const existingIds = existing.map((item) => item.CauHoiID);

  // Lấy câu hỏi chưa thuộc bài kiểm tra
  const cauHois = await prisma.cauhoi.findMany({
    where: {
      CauHoiID: {
        notIn: existingIds.length > 0 ? existingIds : [0],
      },
      TrangThai: 'HIEN',
    },
    include: {
      dapan: {
        orderBy: {
          ThuTuHienThi: 'asc',
        },
      },
    },
    orderBy: {
      CreatedAt: 'desc',
    },
  });

  return cauHois.map((item) => ({
    cauHoiID: item.CauHoiID,
    loaiCauHoi: item.LoaiCauHoi,
    noiDungText: item.NoiDungText,
    noiDungUrl: item.NoiDungUrl,
    soLuongDapAn: item.dapan.length,
    trangThai: item.TrangThai,
    createdAt: item.CreatedAt,
  }));
}
}