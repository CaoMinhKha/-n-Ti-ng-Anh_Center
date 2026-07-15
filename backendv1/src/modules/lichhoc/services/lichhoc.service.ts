// src/modules/lichhoc/services/lichhoc.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateLichHocDto, UpdateLichHocDto, LichHocQueryDto } from '../dto/index.js';

export class LichHocService {
  /**
   * Lấy danh sách lịch học (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: LichHocQueryDto) {
    const {
      page = 1,
      limit = 10,
      lopHoc,
      caHoc,
      thuTrongTuan,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (lopHoc) {
      where.LopHocID = lopHoc;
    }

    if (caHoc) {
      where.CaHocID = caHoc;
    }

    if (thuTrongTuan) {
      where.ThuTrongTuan = thuTrongTuan;
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const total_items = await prisma.lichhoc.count({ where });
    const total_pages = Math.ceil(total_items / limit);

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      ThuTrongTuan: 'ThuTrongTuan',
      NgayApDung: 'NgayApDung',
      NgayKetThuc: 'NgayKetThuc',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    const data = await prisma.lichhoc.findMany({
      where,
      include: {
        lophoc: {
          select: {
            LopHocID: true,
            TenLopHoc: true,
          },
        },
        cahoc: {
          select: {
            CaHocID: true,
            TenCa: true,
            GioBatDau: true,
            GioKetThuc: true,
          },
        },
        phonghoc: {
          select: {
            PhongHocID: true,
            TenPhong: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      id: item.LichHocID,
      lop_hoc_id: item.LopHocID,
      lop_hoc: item.lophoc?.TenLopHoc || null,
      thu_trong_tuan: item.ThuTrongTuan,
      ten_thu: getThuName(item.ThuTrongTuan),
      ca_hoc_id: item.CaHocID,
      ca_hoc: item.cahoc?.TenCa || null,
      gio_bat_dau: item.cahoc?.GioBatDau || null,
      gio_ket_thuc: item.cahoc?.GioKetThuc || null,
      phong_hoc_id: item.PhongHocID,
      phong_hoc: item.phonghoc?.TenPhong || null,
      ngay_ap_dung: item.NgayApDung,
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
   * Lấy danh sách lịch học của lớp
   */
  async getListByLopHoc(lopHocId: number) {
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID: lopHocId },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    const data = await prisma.lichhoc.findMany({
      where: {
        LopHocID: lopHocId,
        TrangThai: 'HOAT_DONG',
      },
      include: {
        cahoc: true,
        phonghoc: true,
      },
      orderBy: {
        ThuTrongTuan: 'asc',
      },
    });

    return data.map((item) => ({
      id: item.LichHocID,
      thu_trong_tuan: item.ThuTrongTuan,
      ten_thu: getThuName(item.ThuTrongTuan),
      ca_hoc: item.cahoc,
      phong_hoc: item.phonghoc,
      ngay_ap_dung: item.NgayApDung,
      ngay_ket_thuc: item.NgayKetThuc,
      trang_thai: item.TrangThai,
    }));
  }

  /**
   * Lấy chi tiết lịch học
   */
  async getById(id: number) {
    const lichHoc = await prisma.lichhoc.findUnique({
      where: { LichHocID: id },
      include: {
        lophoc: {
          include: {
            khoahoc: true,
            giaovien: {
              include: {
                taikhoan: true,
              },
            },
          },
        },
        cahoc: true,
        phonghoc: true,
        buoihoc: {
          orderBy: {
            NgayHoc: 'asc',
          },
        },
      },
    });

    if (!lichHoc) {
      throw new AppError('Lịch học không tồn tại', 404);
    }

    return {
      id: lichHoc.LichHocID,
      lop_hoc: lichHoc.lophoc,
      thu_trong_tuan: lichHoc.ThuTrongTuan,
      ten_thu: getThuName(lichHoc.ThuTrongTuan),
      ca_hoc: lichHoc.cahoc,
      phong_hoc: lichHoc.phonghoc,
      ngay_ap_dung: lichHoc.NgayApDung,
      ngay_ket_thuc: lichHoc.NgayKetThuc,
      trang_thai: lichHoc.TrangThai,
      so_luong_buoi_hoc: lichHoc.buoihoc.length,
      danh_sach_buoi_hoc: lichHoc.buoihoc,
      created_at: lichHoc.CreatedAt,
      updated_at: lichHoc.UpdatedAt,
    };
  }

  /**
   * Tạo lịch học mới
   */
  async create(data: CreateLichHocDto) {
    const { LopHocID, ThuTrongTuan, CaHocID, PhongHocID, NgayApDung, NgayKetThuc, TrangThai } = data;

    // Kiểm tra lớp học tồn tại
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    // Kiểm tra ca học tồn tại
    const caHoc = await prisma.cahoc.findUnique({
      where: { CaHocID },
    });

    if (!caHoc) {
      throw new AppError('Ca học không tồn tại', 404);
    }

    // Kiểm tra phòng học tồn tại
    if (PhongHocID) {
      const phongHoc = await prisma.phonghoc.findUnique({
        where: { PhongHocID },
      });

      if (!phongHoc) {
        throw new AppError('Phòng học không tồn tại', 404);
      }
    }

    // Kiểm tra lịch học đã tồn tại
    const existing = await prisma.lichhoc.findFirst({
      where: {
        LopHocID,
        ThuTrongTuan,
        CaHocID,
      },
    });

    if (existing) {
      throw new AppError('Lịch học đã tồn tại cho lớp này', 409);
    }

    const lichHoc = await prisma.lichhoc.create({
      data: {
        LopHocID,
        ThuTrongTuan,
        CaHocID,
        PhongHocID: PhongHocID || null,
        NgayApDung,
        NgayKetThuc,
        TrangThai: TrangThai || 'HOAT_DONG',
      },
    });

    // Tự động tạo các buổi học
    await this.generateBuoiHoc(lichHoc.LichHocID);

    return {
      id: lichHoc.LichHocID,
      lop_hoc_id: lichHoc.LopHocID,
      thu_trong_tuan: lichHoc.ThuTrongTuan,
      ca_hoc_id: lichHoc.CaHocID,
      phong_hoc_id: lichHoc.PhongHocID,
      ngay_ap_dung: lichHoc.NgayApDung,
      ngay_ket_thuc: lichHoc.NgayKetThuc,
      trang_thai: lichHoc.TrangThai,
      created_at: lichHoc.CreatedAt,
    };
  }

  /**
   * Cập nhật lịch học
   */
  async update(id: number, data: UpdateLichHocDto) {
    const { LopHocID, ThuTrongTuan, CaHocID, PhongHocID, NgayApDung, NgayKetThuc, TrangThai } = data;

    const existing = await prisma.lichhoc.findUnique({
      where: { LichHocID: id },
    });

    if (!existing) {
      throw new AppError('Lịch học không tồn tại', 404);
    }

    // Kiểm tra các ID
    if (LopHocID) {
      const lopHoc = await prisma.lophoc.findUnique({
        where: { LopHocID },
      });
      if (!lopHoc) {
        throw new AppError('Lớp học không tồn tại', 404);
      }
    }

    if (CaHocID) {
      const caHoc = await prisma.cahoc.findUnique({
        where: { CaHocID },
      });
      if (!caHoc) {
        throw new AppError('Ca học không tồn tại', 404);
      }
    }

    if (PhongHocID) {
      const phongHoc = await prisma.phonghoc.findUnique({
        where: { PhongHocID },
      });
      if (!phongHoc) {
        throw new AppError('Phòng học không tồn tại', 404);
      }
    }

    const lichHoc = await prisma.lichhoc.update({
      where: { LichHocID: id },
      data: {
        LopHocID,
        ThuTrongTuan,
        CaHocID,
        PhongHocID,
        NgayApDung,
        NgayKetThuc,
        TrangThai,
      },
    });

    return {
      id: lichHoc.LichHocID,
      lop_hoc_id: lichHoc.LopHocID,
      thu_trong_tuan: lichHoc.ThuTrongTuan,
      ca_hoc_id: lichHoc.CaHocID,
      phong_hoc_id: lichHoc.PhongHocID,
      ngay_ap_dung: lichHoc.NgayApDung,
      ngay_ket_thuc: lichHoc.NgayKetThuc,
      trang_thai: lichHoc.TrangThai,
      updated_at: lichHoc.UpdatedAt,
    };
  }

  /**
   * Xóa lịch học
   */
  async delete(id: number) {
    const existing = await prisma.lichhoc.findUnique({
      where: { LichHocID: id },
      include: {
        buoihoc: true,
      },
    });

    if (!existing) {
      throw new AppError('Lịch học không tồn tại', 404);
    }

    if (existing.buoihoc.length > 0) {
      throw new AppError('Không thể xóa lịch học đã có buổi học', 400);
    }

    await prisma.lichhoc.delete({
      where: { LichHocID: id },
    });

    return {
      id: existing.LichHocID,
      message: 'Xóa lịch học thành công',
    };
  }

  /**
   * Tạo các buổi học từ lịch học
   */
  async generateBuoiHoc(lichHocId: number) {
    const lichHoc = await prisma.lichhoc.findUnique({
      where: { LichHocID: lichHocId },
    });

    if (!lichHoc) {
      throw new AppError('Lịch học không tồn tại', 404);
    }

    const startDate = new Date(lichHoc.NgayApDung);
    const endDate = new Date(lichHoc.NgayKetThuc);
    const thuTrongTuan = lichHoc.ThuTrongTuan;

    let currentDate = new Date(startDate);
    let count = 0;

    while (currentDate <= endDate) {
      if (currentDate.getDay() === thuTrongTuan) {
        // Kiểm tra buổi học đã tồn tại
        const existing = await prisma.buoihoc.findFirst({
          where: {
            LichHocID: lichHocId,
            NgayHoc: currentDate,
          },
        });

        if (!existing) {
          await prisma.buoihoc.create({
            data: {
              LopHocID: lichHoc.LopHocID,
              LichHocID: lichHocId,
              CaHocID: lichHoc.CaHocID,
              PhongHocID: lichHoc.PhongHocID,
              NgayHoc: currentDate,
              TrangThai: 'CHUA_HOC',
            },
          });
          count++;
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return { message: `Đã tạo ${count} buổi học`, count };
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'HOAT_DONG', label: 'Hoạt động' },
      { value: 'TAM_DUNG', label: 'Tạm dừng' },
    ];
  }

  /**
   * Lấy danh sách thứ trong tuần (dropdown)
   */
  async getThuOptions() {
    return [
      { value: 2, label: 'Thứ 2' },
      { value: 3, label: 'Thứ 3' },
      { value: 4, label: 'Thứ 4' },
      { value: 5, label: 'Thứ 5' },
      { value: 6, label: 'Thứ 6' },
      { value: 7, label: 'Thứ 7' },
      { value: 1, label: 'Chủ nhật' },
    ];
  }
}

/**
 * Helper: Lấy tên thứ từ số
 */
function getThuName(thu: number): string {
  const map: Record<number, string> = {
    1: 'Chủ nhật',
    2: 'Thứ 2',
    3: 'Thứ 3',
    4: 'Thứ 4',
    5: 'Thứ 5',
    6: 'Thứ 6',
    7: 'Thứ 7',
  };
  return map[thu] || 'Không xác định';
}