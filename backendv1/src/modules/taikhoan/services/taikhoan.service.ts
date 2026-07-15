// src/modules/taikhoan/services/taikhoan.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { hashPassword } from '../../auth/utils/bcrypt.util.js';
import {
  CreateTaiKhoanDto,
  UpdateTaiKhoanDto,
  TaiKhoanQueryDto,
} from '../dto/index.js';

export class TaiKhoanService {
  /**
   * Lấy danh sách tài khoản (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: TaiKhoanQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      role = 'ALL',
      status = 'ALL',
      sort_by = 'createdAt',
      order = 'desc',
    } = query;

    const where: any = {
      IsDeleted: false,
    };

    // Tìm kiếm
    if (search) {
      where.OR = [
        { Email: { contains: search } },
        { HoVaTen: { contains: search } },
      ];
    }

    // Lọc theo role
    if (role && role !== 'ALL') {
      where.VaiTro = role;
    }

    // Lọc theo trạng thái
    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    // Đếm tổng
    const totalItems = await prisma.taikhoan.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    //  Map sort_by từ camelCase sang Prisma field
    const sortFieldMap: Record<string, string> = {
      createdAt: 'CreatedAt',
      email: 'Email',
      hoVaTen: 'HoVaTen',
      vaiTro: 'VaiTro',
      trangThai: 'TrangThai',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    const orderBy: any = { [sortField]: order };

    // Lấy dữ liệu
    const data = await prisma.taikhoan.findMany({
      where,
      select: {
        TaiKhoanID: true,
        Email: true,
        HoVaTen: true,
        NgaySinh: true,
        GioiTinh: true,
        AvatarUrl: true,
        VaiTro: true,
        TrangThai: true,
        EmailVerifiedAt: true,
        CreatedAt: true,
        UpdatedAt: true,
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    //  Trả về camelCase
    const formattedData = data.map((item) => ({
      taiKhoanID: item.TaiKhoanID,
      email: item.Email,
      hoVaTen: item.HoVaTen,
      ngaySinh: item.NgaySinh,
      gioiTinh: item.GioiTinh,
      avatarUrl: item.AvatarUrl,
      vaiTro: item.VaiTro,
      trangThai: item.TrangThai,
      emailVerifiedAt: item.EmailVerifiedAt,
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
   * Lấy danh sách role (dropdown)
   */
  async getRoles() {
    return [
      { value: 'ADMIN', label: 'Admin' },
      { value: 'GIAO_VIEN', label: 'Giáo viên' },
      { value: 'HOC_VIEN', label: 'Học viên' },
    ];
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatuses() {
    return [
      { value: 'HOAT_DONG', label: 'Hoạt động' },
      { value: 'KHOA', label: 'Khóa' },
      { value: 'CHO_XAC_THUC', label: 'Chờ xác thực' },
    ];
  }

  /**
   * Lấy chi tiết tài khoản
   */
  async getById(id: number) {
    const user = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: id },
      select: {
        TaiKhoanID: true,
        Email: true,
        HoVaTen: true,
        NgaySinh: true,
        GioiTinh: true,
        AvatarUrl: true,
        VaiTro: true,
        TrangThai: true,
        EmailVerifiedAt: true,
        CreatedAt: true,
        UpdatedAt: true,
        IsDeleted: true
      },
    });

    if (!user || user.IsDeleted) {
      throw new AppError('Tài khoản không tồn tại', 404);
    }

    // Lấy thêm thông tin role cụ thể
    let roleInfo = null;
    if (user.VaiTro === 'HOC_VIEN') {
      const hocVien = await prisma.hocvien.findUnique({
        where: { TaiKhoanID: id },
      });
      if (hocVien) {
        roleInfo = {
          maHocVien: hocVien.MaHocVien,
          hocVienID: hocVien.HocVienID,
        };
      }
    } else if (user.VaiTro === 'GIAO_VIEN') {
      const giaoVien = await prisma.giaovien.findUnique({
        where: { TaiKhoanID: id },
      });
      if (giaoVien) {
        roleInfo = {
          maGiaoVien: giaoVien.MaGiaoVien,
          giaoVienID: giaoVien.GiaoVienID,
        };
      }
    }

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      email: user.Email,
      hoVaTen: user.HoVaTen,
      ngaySinh: user.NgaySinh,
      gioiTinh: user.GioiTinh,
      avatarUrl: user.AvatarUrl,
      vaiTro: user.VaiTro,
      trangThai: user.TrangThai,
      emailVerifiedAt: user.EmailVerifiedAt,
      createdAt: user.CreatedAt,
      updatedAt: user.UpdatedAt,
      roleInfo,
    };
  }

  /**
   * Tạo tài khoản mới (Admin)
   */
  async create(data: CreateTaiKhoanDto) {
    const { email, password, hoVaTen, vaiTro, ngaySinh, gioiTinh, avatarUrl } = data;

    // Kiểm tra email đã tồn tại
    const existing = await prisma.taikhoan.findUnique({
      where: { Email: email },
    });

    if (existing) {
      throw new AppError('Email đã được sử dụng', 409);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.taikhoan.create({
      data: {
        Email: email,
        MatKhauHash: hashedPassword,
        HoVaTen: hoVaTen,
        NgaySinh: ngaySinh || null,
        GioiTinh: gioiTinh || 'KHAC',
        AvatarUrl: avatarUrl || null,
        VaiTro: vaiTro,
        TrangThai: 'HOAT_DONG',
        EmailVerifiedAt: new Date(),
        IsDeleted: false,
      },
    });

    // Tạo bản ghi role cụ thể
    if (vaiTro === 'HOC_VIEN') {
      const lastStudent = await prisma.hocvien.findFirst({
        orderBy: { HocVienID: 'desc' },
        select: { MaHocVien: true },
      });

      let nextNumber = 1;
      if (lastStudent?.MaHocVien) {
        const num = parseInt(lastStudent.MaHocVien.replace('HV', ''));
        if (!isNaN(num)) nextNumber = num + 1;
      }
      const maHocVien = `HV${String(nextNumber).padStart(6, '0')}`;

      await prisma.hocvien.create({
        data: {
          TaiKhoanID: user.TaiKhoanID,
          MaHocVien: maHocVien,
        },
      });
    } else if (vaiTro === 'GIAO_VIEN') {
      const lastTeacher = await prisma.giaovien.findFirst({
        orderBy: { GiaoVienID: 'desc' },
        select: { MaGiaoVien: true },
      });

      let nextNumber = 1;
      if (lastTeacher?.MaGiaoVien) {
        const num = parseInt(lastTeacher.MaGiaoVien.replace('GV', ''));
        if (!isNaN(num)) nextNumber = num + 1;
      }
      const maGiaoVien = `GV${String(nextNumber).padStart(6, '0')}`;

      await prisma.giaovien.create({
        data: {
          TaiKhoanID: user.TaiKhoanID,
          MaGiaoVien: maGiaoVien,
        },
      });
    }

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      email: user.Email,
      hoVaTen: user.HoVaTen,
      vaiTro: user.VaiTro,
      trangThai: user.TrangThai,
      createdAt: user.CreatedAt,
    };
  }

  /**
   * Cập nhật tài khoản
   */
  async update(id: number, data: UpdateTaiKhoanDto) {
    const { hoVaTen, ngaySinh, gioiTinh, avatarUrl, vaiTro, trangThai } = data;

    const existing = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Tài khoản không tồn tại', 404);
    }

    const user = await prisma.taikhoan.update({
      where: { TaiKhoanID: id },
      data: {
        HoVaTen: hoVaTen,
        NgaySinh: ngaySinh,
        GioiTinh: gioiTinh,
        AvatarUrl: avatarUrl,
        VaiTro: vaiTro,
        TrangThai: trangThai,
      },
    });

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      email: user.Email,
      hoVaTen: user.HoVaTen,
      vaiTro: user.VaiTro,
      trangThai: user.TrangThai,
      updatedAt: user.UpdatedAt,
    };
  }

  /**
   * Xóa tài khoản (xóa mềm)
   */
  async delete(id: number) {
    const existing = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Tài khoản không tồn tại', 404);
    }

    // Không cho xóa Admin cuối cùng
    if (existing.VaiTro === 'ADMIN') {
      const adminCount = await prisma.taikhoan.count({
        where: {
          VaiTro: 'ADMIN',
          IsDeleted: false,
        },
      });

      if (adminCount <= 1) {
        throw new AppError('Không thể xóa Admin cuối cùng của hệ thống', 400);
      }
    }

    const user = await prisma.taikhoan.update({
      where: { TaiKhoanID: id },
      data: {
        IsDeleted: true,
        TrangThai: 'KHOA',
        RefreshToken: null,
        RefreshTokenExpireAt: null,
      },
    });

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      message: 'Xóa tài khoản thành công',
    };
  }

  /**
   * Khóa/Mở khóa tài khoản
   */
  async toggleStatus(id: number, trangThai: 'HOAT_DONG' | 'KHOA') {
    const existing = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Tài khoản không tồn tại', 404);
    }

    // Không cho khóa Admin cuối cùng
    if (existing.VaiTro === 'ADMIN' && trangThai === 'KHOA') {
      const adminCount = await prisma.taikhoan.count({
        where: {
          VaiTro: 'ADMIN',
          IsDeleted: false,
          TrangThai: 'HOAT_DONG',
        },
      });

      if (adminCount <= 1) {
        throw new AppError('Không thể khóa Admin cuối cùng của hệ thống', 400);
      }
    }

    const user = await prisma.taikhoan.update({
      where: { TaiKhoanID: id },
      data: {
        TrangThai: trangThai,
        ...(trangThai === 'KHOA' && {
          RefreshToken: null,
          RefreshTokenExpireAt: null,
        }),
      },
    });

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      email: user.Email,
      trangThai: user.TrangThai,
      message: trangThai === 'HOAT_DONG'
        ? 'Mở khóa tài khoản thành công'
        : 'Khóa tài khoản thành công',
    };
  }

  /**
   * Đặt lại mật khẩu (Admin)
   */
  async resetPassword(id: number, newPassword: string) {
    const existing = await prisma.taikhoan.findUnique({
      where: { TaiKhoanID: id },
    });

    if (!existing || existing.IsDeleted) {
      throw new AppError('Tài khoản không tồn tại', 404);
    }

    const hashedPassword = await hashPassword(newPassword);

    const user = await prisma.taikhoan.update({
      where: { TaiKhoanID: id },
      data: {
        MatKhauHash: hashedPassword,
        RefreshToken: null,
        RefreshTokenExpireAt: null,
      },
    });

    //  Trả về camelCase
    return {
      taiKhoanID: user.TaiKhoanID,
      email: user.Email,
      message: 'Đặt lại mật khẩu thành công',
    };
  }

  /**
   * Lấy danh sách tài khoản theo role (dropdown)
   */
  async getByRole(role: 'ADMIN' | 'GIAO_VIEN' | 'HOC_VIEN') {
    const users = await prisma.taikhoan.findMany({
      where: {
        VaiTro: role,
        IsDeleted: false,
        TrangThai: 'HOAT_DONG',
      },
      select: {
        TaiKhoanID: true,
        Email: true,
        HoVaTen: true,
      },
      orderBy: {
        HoVaTen: 'asc',
      },
    });

    return users.map((item) => ({
      value: item.TaiKhoanID,
      label: `${item.HoVaTen} (${item.Email})`,
    }));
  }
}