// src/modules/lophoc/services/lophoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateLopHocDto, UpdateLopHocDto, LopHocQueryDto } from '../dto/index.js';

export class LopHocService {
  /**
   * Lấy danh sách lớp học (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: LopHocQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      dotKhaiGiang,
      khoaHoc,
      giaoVien,
      hinhThucHoc,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    // Xây dựng điều kiện where
    const where: any = {};

    // Tìm kiếm theo tên
    if (search) {
      where.TenLopHoc = { contains: search,  };
    }

    // Lọc theo đợt khai giảng
    if (dotKhaiGiang) {
      where.DotKhaiGiangID = dotKhaiGiang;
    }

    // Lọc theo khóa học
    if (khoaHoc) {
      where.KhoaHocID = khoaHoc;
    }

    // Lọc theo giáo viên
    if (giaoVien) {
      where.GiaoVienID = giaoVien;
    }

    // Lọc theo hình thức học
    if (hinhThucHoc) {
      where.HinhThucHoc = hinhThucHoc;
    }

    // Lọc theo trạng thái
    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    // Tính tổng số items
    const total_items = await prisma.lophoc.count({ where });

    // Tính số trang
    const total_pages = Math.ceil(total_items / limit);

    // Xác định field sắp xếp
    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      TenLopHoc: 'TenLopHoc',
      NgayBatDau: 'NgayBatDau',
      NgayKetThuc: 'NgayKetThuc',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    // Lấy dữ liệu
    const data = await prisma.lophoc.findMany({
      where,
      include: {
        dotkhaigiang: {
          select: {
            DotKhaiGiangID: true,
            MaDot: true,
            TenDot: true,
          },
        },
        khoahoc: {
          select: {
            KhoaHocID: true,
            TenKhoaHoc: true,
          },
        },
        giaovien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
              },
            },
          },
        },
        _count: {
          select: {
            hocvien_lophoc: {
              where: {
                TrangThai: 'DA_DUYET',
              },
            },
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format dữ liệu trả về
    const formattedData = data.map((item) => ({
      id: item.LopHocID,
      ten_lop_hoc: item.TenLopHoc,
      dot_khai_giang: item.dotkhaigiang.MaDot || null,
      dot_khai_giang_id: item.DotKhaiGiangID,
      khoa_hoc: item.khoahoc?.TenKhoaHoc || null,
      khoa_hoc_id: item.KhoaHocID,
      giao_vien: item.giaovien?.taikhoan?.HoVaTen || null,
      giao_vien_id: item.GiaoVienID,
      hinh_thuc_hoc: item.HinhThucHoc,
      hoc_phi: item.HocPhi,
      si_so_toi_da: item.SiSoToiDa,
      si_so_hien_tai: item._count.hocvien_lophoc,
      ngay_bat_dau: item.NgayBatDau,
      ngay_ket_thuc: item.NgayKetThuc,
      trang_thai: item.TrangThai,
      created_at: item.CreatedAt,
      updated_at: item.UpdatedAt,
    }));

    return {
      total_items,
      total_pages,
      current_page: page,
      limit,
      data: formattedData,
    };
  }

  /**
   * Lấy danh sách hình thức học (dropdown)
   */
  async getHinhThucOptions() {
    return [
      { value: 'ONLLINE', label: 'Online' },
      { value: 'OFFLINE', label: 'Offline' },
    ];
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'SAP_KHAI_GIANG', label: 'Sắp khai giảng' },
      { value: 'DANG_HOC', label: 'Đang học' },
      { value: 'DA_KET_THUC', label: 'Đã kết thúc' },
      { value: 'DA_HUY', label: 'Đã hủy' },
    ];
  }

  /**
   * Lấy danh sách lớp học (dropdown)
   */
  async getOptions() {
    const lopHocs = await prisma.lophoc.findMany({
      where: {
        TrangThai: {
          in: ['SAP_KHAI_GIANG', 'DANG_HOC'],
        },
      },
      orderBy: {
        TenLopHoc: 'asc',
      },
    });

    return lopHocs.map((item) => ({
      value: item.LopHocID,
      label: `${item.TenLopHoc} (${item.HinhThucHoc})`,
    }));
  }

  /**
   * Lấy chi tiết lớp học
   */
  async getById(id: number) {
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID: id },
      include: {
        dotKhaiGiang: true,
        khoahoc: {
          include: {
            trinhdo: true,
          },
        },
        giaovien: {
          include: {
            taikhoan: true,
          },
        },
        hocvien_lophoc: {
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
        },
      },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    const soLuongDaDuyet = lopHoc.hocvien_lophoc.filter(
      (item) => item.TrangThai === 'DA_DUYET'
    ).length;

    const soLuongChoDuyet = lopHoc.hocvien_lophoc.filter(
      (item) => item.TrangThai === 'CHO_DUYET'
    ).length;

    return {
      id: lopHoc.LopHocID,
      ten_lop_hoc: lopHoc.TenLopHoc,
      dot_khai_giang: lopHoc.dotKhaiGiang,
      khoa_hoc: lopHoc.khoahoc,
      trinh_do: lopHoc.khoahoc?.trinhdo,
      giao_vien: lopHoc.giaovien,
      hinh_thuc_hoc: lopHoc.HinhThucHoc,
      hoc_phi: lopHoc.HocPhi,
      si_so_toi_da: lopHoc.SiSoToiDa,
      si_so_hien_tai: soLuongDaDuyet,
      so_luong_cho_duyet: soLuongChoDuyet,
      ngay_bat_dau: lopHoc.NgayBatDau,
      ngay_ket_thuc: lopHoc.NgayKetThuc,
      trang_thai: lopHoc.TrangThai,
      danh_sach_hoc_vien: lopHoc.hocvien_lophoc.map((item) => ({
        id: item.HocVien_LopHocID,
        hoc_vien: item.hocvien,
        hoc_phi: item.HocPhi,
        ngay_dang_ky: item.NgayDangKy,
        dong_hoc_phi: item.DongHocPhi,
        trang_thai: item.TrangThai,
      })),
      created_at: lopHoc.CreatedAt,
      updated_at: lopHoc.UpdatedAt,
    };
  }

  /**
   * Tạo lớp học mới
   */
  async create(data: CreateLopHocDto) {
    const {
      DotKhaiGiangID,
      KhoaHocID,
      GiaoVienID,
      TenLopHoc,
      HinhThucHoc,
      HocPhi,
      SiSoToiDa,
      NgayBatDau,
      NgayKetThuc,
      TrangThai,
    } = data;

    // Kiểm tra đợt khai giảng tồn tại
    const dotKhaiGiang = await prisma.dotkhaigiang.findUnique({
      where: { DotKhaiGiangID },
    });

    if (!dotKhaiGiang) {
      throw new AppError('Đợt khai giảng không tồn tại', 404);
    }

    // Kiểm tra khóa học tồn tại
    const khoaHoc = await prisma.khoahoc.findUnique({
      where: { KhoaHocID },
    });

    if (!khoaHoc || khoaHoc.IsDeleted) {
      throw new AppError('Khóa học không tồn tại', 404);
    }

    // Kiểm tra giáo viên tồn tại
    const giaoVien = await prisma.giaovien.findUnique({
      where: { GiaoVienID },
    });

    if (!giaoVien) {
      throw new AppError('Giáo viên không tồn tại', 404);
    }

    // Kiểm tra tên lớp trùng
    const existing = await prisma.lophoc.findFirst({
      where: { TenLopHoc },
    });

    if (existing) {
      throw new AppError('Tên lớp học đã tồn tại', 409);
    }

    // Xác định trạng thái
    let trangThai = TrangThai || 'SAP_KHAI_GIANG';

    // Tạo lớp học
    const lopHoc = await prisma.lophoc.create({
      data: {
        DotKhaiGiangID,
        KhoaHocID,
        GiaoVienID,
        TenLopHoc,
        HinhThucHoc,
        HocPhi: HocPhi || 0,
        SiSoToiDa: SiSoToiDa || 30,
        NgayBatDau,
        NgayKetThuc,
        TrangThai: trangThai,
      },
    });

    return {
      id: lopHoc.LopHocID,
      ten_lop_hoc: lopHoc.TenLopHoc,
      hinh_thuc_hoc: lopHoc.HinhThucHoc,
      hoc_phi: lopHoc.HocPhi,
      si_so_toi_da: lopHoc.SiSoToiDa,
      ngay_bat_dau: lopHoc.NgayBatDau,
      ngay_ket_thuc: lopHoc.NgayKetThuc,
      trang_thai: lopHoc.TrangThai,
      created_at: lopHoc.CreatedAt,
    };
  }

  /**
   * Cập nhật lớp học
   */
  async update(id: number, data: UpdateLopHocDto) {
    const {
      DotKhaiGiangID,
      KhoaHocID,
      GiaoVienID,
      TenLopHoc,
      HinhThucHoc,
      HocPhi,
      SiSoToiDa,
      NgayBatDau,
      NgayKetThuc,
      TrangThai,
    } = data;

    // Kiểm tra tồn tại
    const existing = await prisma.lophoc.findUnique({
      where: { LopHocID: id },
    });

    if (!existing) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    // Kiểm tra các ID nếu có
    if (DotKhaiGiangID) {
      const dotKhaiGiang = await prisma.dotkhaigiang.findUnique({
        where: { DotKhaiGiangID },
      });
      if (!dotKhaiGiang) {
        throw new AppError('Đợt khai giảng không tồn tại', 404);
      }
    }

    if (KhoaHocID) {
      const khoaHoc = await prisma.khoahoc.findUnique({
        where: { KhoaHocID },
      });
      if (!khoaHoc || khoaHoc.IsDeleted) {
        throw new AppError('Khóa học không tồn tại', 404);
      }
    }

    if (GiaoVienID) {
      const giaoVien = await prisma.giaovien.findUnique({
        where: { GiaoVienID },
      });
      if (!giaoVien) {
        throw new AppError('Giáo viên không tồn tại', 404);
      }
    }

    // Kiểm tra tên trùng
    if (TenLopHoc && TenLopHoc !== existing.TenLopHoc) {
      const duplicate = await prisma.lophoc.findFirst({
        where: {
          TenLopHoc: TenLopHoc,
          LopHocID: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError('Tên lớp học đã tồn tại', 409);
      }
    }

    // Cập nhật
    const lopHoc = await prisma.lophoc.update({
      where: { LopHocID: id },
      data: {
        DotKhaiGiangID,
        KhoaHocID,
        GiaoVienID,
        TenLopHoc,
        HinhThucHoc,
        HocPhi,
        SiSoToiDa,
        NgayBatDau,
        NgayKetThuc,
        TrangThai,
      },
    });

    return {
      id: lopHoc.LopHocID,
      ten_lop_hoc: lopHoc.TenLopHoc,
      hinh_thuc_hoc: lopHoc.HinhThucHoc,
      hoc_phi: lopHoc.HocPhi,
      si_so_toi_da: lopHoc.SiSoToiDa,
      ngay_bat_dau: lopHoc.NgayBatDau,
      ngay_ket_thuc: lopHoc.NgayKetThuc,
      trang_thai: lopHoc.TrangThai,
      updated_at: lopHoc.UpdatedAt,
    };
  }

  /**
   * Xóa lớp học
   */
  async delete(id: number) {
    const existing = await prisma.lophoc.findUnique({
      where: { LopHocID: id },
      include: {
        hocvien_lophoc: {
          where: {
            TrangThai: 'DA_DUYET',
          },
        },
        buoihoc: true,
        lichhoc: true,
      },
    });

    if (!existing) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    // Kiểm tra có học viên đã duyệt không
    if (existing.hocvien_lophoc.length > 0) {
      throw new AppError('Không thể xóa lớp đã có học viên đăng ký', 400);
    }

    // Kiểm tra có buổi học không
    if (existing.buoihoc.length > 0) {
      throw new AppError('Không thể xóa lớp đã có buổi học', 400);
    }

    // Kiểm tra có lịch học không
    if (existing.lichhoc.length > 0) {
      throw new AppError('Không thể xóa lớp đã có lịch học', 400);
    }

    // Xóa
    await prisma.lophoc.delete({
      where: { LopHocID: id },
    });

    return {
      id: existing.LopHocID,
      message: 'Xóa lớp học thành công',
    };
  }
}
