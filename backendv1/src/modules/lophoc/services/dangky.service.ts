// src/modules/lophoc/services/dangky.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { DangKyHocVienDto, DuyetDangKyDto } from '../dto/index.js';

export class DangKyService {
  /**
   * Đăng ký học viên vào lớp
   */
  async dangKy(lopHocId: number, data: DangKyHocVienDto) {
    const { HocVienID, HocPhi } = data;

    // Kiểm tra lớp học tồn tại và còn nhận học viên
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID: lopHocId },
      include: {
        hocvien_lophoc: {
          where: {
            TrangThai: 'DA_DUYET',
          },
        },
      },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    if (lopHoc.TrangThai === 'DA_KET_THUC' || lopHoc.TrangThai === 'DA_HUY') {
      throw new AppError('Lớp học đã kết thúc hoặc đã hủy', 400);
    }

    // Kiểm tra sĩ số
    if (lopHoc.hocvien_lophoc.length >= (lopHoc.SiSoToiDa || 30)) {
      throw new AppError('Lớp học đã đủ sĩ số', 400);
    }

    // Kiểm tra học viên tồn tại
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Kiểm tra đã đăng ký chưa
    const existing = await prisma.hocvien_lophoc.findFirst({
      where: {
        HocVienID,
        LopHocID: lopHocId,
      },
    });

    if (existing) {
      throw new AppError('Học viên đã đăng ký lớp này', 409);
    }

    // Tạo đăng ký
    const dangKy = await prisma.hocvien_lophoc.create({
      data: {
        HocVienID,
        LopHocID: lopHocId,
        HocPhi: HocPhi || lopHoc.HocPhi || 0,
        NgayDangKy: new Date(),
        DongHocPhi: false,
        TrangThai: 'CHO_DUYET',
      },
    });

    return {
      id: dangKy.HocVien_LopHocID,
      hoc_vien_id: dangKy.HocVienID,
      lop_hoc_id: dangKy.LopHocID,
      hoc_phi: dangKy.HocPhi,
      ngay_dang_ky: dangKy.NgayDangKy,
      dong_hoc_phi: dangKy.DongHocPhi,
      trang_thai: dangKy.TrangThai,
    };
  }

  /**
   * Duyệt hoặc từ chối đăng ký
   */
  async duyetDangKy(dangKyId: number, data: DuyetDangKyDto) {
    const { trangThai } = data;

    // Kiểm tra đăng ký tồn tại
    const dangKy = await prisma.hocvien_lophoc.findUnique({
      where: { HocVien_LopHocID: dangKyId },
      include: {
        lophoc: {
          include: {
            hocvien_lophoc: {
              where: {
                TrangThai: 'DA_DUYET',
              },
            },
          },
        },
      },
    });

    if (!dangKy) {
      throw new AppError('Đăng ký không tồn tại', 404);
    }

    if (dangKy.TrangThai !== 'CHO_DUYET') {
      throw new AppError('Đăng ký đã được xử lý', 400);
    }

    // Nếu duyệt, kiểm tra sĩ số
    if (trangThai === 'DA_DUYET') {
      if (dangKy.lophoc.hocvien_lophoc.length >= (dangKy.lophoc.SiSoToiDa || 30)) {
        throw new AppError('Lớp học đã đủ sĩ số', 400);
      }
    }

    // Cập nhật
    const updated = await prisma.hocvien_lophoc.update({
      where: { HocVien_LopHocID: dangKyId },
      data: {
        TrangThai: trangThai,
      },
    });

    return {
      id: updated.HocVien_LopHocID,
      hoc_vien_id: updated.HocVienID,
      lop_hoc_id: updated.LopHocID,
      trang_thai: updated.TrangThai,
      updated_at: updated.UpdatedAt,
    };
  }

  /**
   * Lấy danh sách đăng ký của lớp
   */
  async getListByLopHoc(lopHocId: number) {
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID: lopHocId },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    const danhSach = await prisma.hocvien_lophoc.findMany({
      where: { LopHocID: lopHocId },
      include: {
        hocvien: {
          include: {
            taikhoan: true,
          },
        },
      },
      orderBy: {
        NgayDangKy: 'desc',
      },
    });

    return danhSach.map((item) => ({
      id: item.HocVien_LopHocID,
      hoc_vien: item.hocvien,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      hoc_phi: item.HocPhi,
      ngay_dang_ky: item.NgayDangKy,
      dong_hoc_phi: item.DongHocPhi,
      trang_thai: item.TrangThai,
    }));
  }
}