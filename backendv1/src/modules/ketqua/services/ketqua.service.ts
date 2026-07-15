// src/modules/ketqua/services/ketqua.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import {
  CreateKetQuaDto,
  UpdateKetQuaDto,
  KetQuaQueryDto,
  TienDoQueryDto,
} from '../dto/index.js';

export class KetQuaService {
  // =============================================
  // KẾT QUẢ HỌC TẬP
  // =============================================

  async getList(query: KetQuaQueryDto) {
    const {
      page = 1,
      limit = 10,
      hocVien,
      lopHoc,
      xepLoai = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (hocVien) {
      where.HocVienID = hocVien;
    }

    if (lopHoc) {
      where.LopHocID = lopHoc;
    }

    if (xepLoai && xepLoai !== 'ALL') {
      where.XepLoai = xepLoai;
    }

    const total_items = await prisma.ketquahoctap.count({ where });
    const total_pages = Math.ceil(total_items / limit);

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      TongDiem: 'TongDiem',
      DiemChuyenCan: 'DiemChuyenCan',
      DiemBaiTap: 'DiemBaiTap',
      DiemKiemTra: 'DiemKiemTra',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    const data = await prisma.ketquahoctap.findMany({
      where,
      include: {
        hocvien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
                Email: true,
              },
            },
          },
        },
        lophoc: {
          select: {
            LopHocID: true,
            TenLopHoc: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      id: item.KetQuaHocTapID,
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      lop_hoc_id: item.LopHocID,
      ten_lop_hoc: item.lophoc?.TenLopHoc || null,
      diem_chuyen_can: item.DiemChuyenCan,
      diem_bai_tap: item.DiemBaiTap,
      diem_kiem_tra: item.DiemKiemTra,
      tong_diem: item.TongDiem,
      xep_loai: item.XepLoai,
      ngay_cap_nhat: item.NgayCapNhat,
    }));

    return {
      total_items,
      total_pages,
      current_page: page,
      limit,
      data: formattedData,
    };
  }

  async getListByHocVien(hocVienId: number) {
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID: hocVienId },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    const data = await prisma.ketquahoctap.findMany({
      where: { HocVienID: hocVienId },
      include: {
        lophoc: {
          select: {
            LopHocID: true,
            TenLopHoc: true,
            khoahoc: {
              select: {
                TenKhoaHoc: true,
              },
            },
          },
        },
      },
      orderBy: {
        NgayCapNhat: 'desc',
      },
    });

    return data.map((item) => ({
      id: item.KetQuaHocTapID,
      lop_hoc: item.lophoc?.TenLopHoc || null,
      khoa_hoc: item.lophoc?.khoahoc?.TenKhoaHoc || null,
      diem_chuyen_can: item.DiemChuyenCan,
      diem_bai_tap: item.DiemBaiTap,
      diem_kiem_tra: item.DiemKiemTra,
      tong_diem: item.TongDiem,
      xep_loai: item.XepLoai,
      ngay_cap_nhat: item.NgayCapNhat,
    }));
  }

  async getListByLopHoc(lopHocId: number) {
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID: lopHocId },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    const data = await prisma.ketquahoctap.findMany({
      where: { LopHocID: lopHocId },
      include: {
        hocvien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
                Email: true,
              },
            },
          },
        },
      },
      orderBy: {
        TongDiem: 'desc',
      },
    });

    return data.map((item) => ({
      id: item.KetQuaHocTapID,
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      email: item.hocvien?.taikhoan?.Email || null,
      diem_chuyen_can: item.DiemChuyenCan,
      diem_bai_tap: item.DiemBaiTap,
      diem_kiem_tra: item.DiemKiemTra,
      tong_diem: item.TongDiem,
      xep_loai: item.XepLoai,
      ngay_cap_nhat: item.NgayCapNhat,
    }));
  }

  async getXepLoaiOptions() {
    return [
      { value: 'XUAT_SAC', label: 'Xuất sắc' },
      { value: 'GIOI', label: 'Giỏi' },
      { value: 'KHA', label: 'Khá' },
      { value: 'TRUNG_BINH', label: 'Trung bình' },
      { value: 'KHONG_DAT', label: 'Không đạt' },
    ];
  }

  async getById(id: number) {
    const ketQua = await prisma.ketquahoctap.findUnique({
      where: { KetQuaHocTapID: id },
      include: {
        hocvien: {
          include: {
            taikhoan: true,
          },
        },
        lophoc: {
          include: {
            khoahoc: true,
          },
        },
      },
    });

    if (!ketQua) {
      throw new AppError('Kết quả học tập không tồn tại', 404);
    }

    return {
      id: ketQua.KetQuaHocTapID,
      hoc_vien: ketQua.hocvien,
      lop_hoc: ketQua.lophoc,
      khoa_hoc: ketQua.lophoc?.khoahoc,
      diem_chuyen_can: ketQua.DiemChuyenCan,
      diem_bai_tap: ketQua.DiemBaiTap,
      diem_kiem_tra: ketQua.DiemKiemTra,
      tong_diem: ketQua.TongDiem,
      xep_loai: ketQua.XepLoai,
      ngay_cap_nhat: ketQua.NgayCapNhat,
    };
  }

  async create(data: CreateKetQuaDto) {
    const { HocVienID, LopHocID, DiemChuyenCan, DiemBaiTap, DiemKiemTra, TongDiem, XepLoai } = data;

    // Kiểm tra điểm hợp lệ
    if (DiemChuyenCan !== undefined && (DiemChuyenCan < 0 || DiemChuyenCan > 10)) {
      throw new AppError('Điểm chuyên cần phải từ 0 đến 10', 400);
    }
    if (DiemBaiTap !== undefined && (DiemBaiTap < 0 || DiemBaiTap > 10)) {
      throw new AppError('Điểm bài tập phải từ 0 đến 10', 400);
    }
    if (DiemKiemTra !== undefined && (DiemKiemTra < 0 || DiemKiemTra > 10)) {
      throw new AppError('Điểm kiểm tra phải từ 0 đến 10', 400);
    }
    if (TongDiem !== undefined && (TongDiem < 0 || TongDiem > 10)) {
      throw new AppError('Tổng điểm phải từ 0 đến 10', 400);
    }

    // Kiểm tra học viên tồn tại
    const hocVien = await prisma.hocvien.findUnique({
      where: { HocVienID },
    });

    if (!hocVien) {
      throw new AppError('Học viên không tồn tại', 404);
    }

    // Kiểm tra lớp học tồn tại
    const lopHoc = await prisma.lophoc.findUnique({
      where: { LopHocID },
    });

    if (!lopHoc) {
      throw new AppError('Lớp học không tồn tại', 404);
    }

    // Kiểm tra đã có kết quả chưa
    const existing = await prisma.ketquahoctap.findFirst({
      where: {
        HocVienID,
        LopHocID,
      },
    });

    const diemCC = Number(DiemChuyenCan ?? 0);
  const diemBT = Number(DiemBaiTap ?? 0);
  const diemKT = Number(DiemKiemTra ?? 0);

    if (existing) {
      throw new AppError('Học viên đã có kết quả cho lớp này', 409);
    }
    // Tính tổng điểm nếu chưa có
    let tong = TongDiem !== undefined ? Number(TongDiem) : undefined;
  if (tong === undefined) {
    tong = (diemCC + diemBT + diemKT) / 3;
    tong = Math.round(tong * 100) / 100;
  }

    // Xác định xếp loại
    let xepLoaiFinal = XepLoai;
    if (!xepLoaiFinal && tong !== undefined) {
      if (tong >= 9) xepLoaiFinal = 'XUAT_SAC';
      else if (tong >= 8) xepLoaiFinal = 'GIOI';
      else if (tong >= 6.5) xepLoaiFinal = 'KHA';
      else if (tong >= 5) xepLoaiFinal = 'TRUNG_BINH';
      else xepLoaiFinal = 'KHONG_DAT';
    }

    const ketQua = await prisma.ketquahoctap.create({
      data: {
        HocVienID,
        LopHocID,
        DiemChuyenCan: DiemChuyenCan ?? 0,
        DiemBaiTap: DiemBaiTap ?? 0,
        DiemKiemTra: DiemKiemTra ?? 0,
        TongDiem: tong,
        XepLoai: xepLoaiFinal || null,
        NgayCapNhat: new Date(),
      },
    });

    return {
      id: ketQua.KetQuaHocTapID,
      hoc_vien_id: ketQua.HocVienID,
      lop_hoc_id: ketQua.LopHocID,
      diem_chuyen_can: ketQua.DiemChuyenCan,
      diem_bai_tap: ketQua.DiemBaiTap,
      diem_kiem_tra: ketQua.DiemKiemTra,
      tong_diem: ketQua.TongDiem,
      xep_loai: ketQua.XepLoai,
      ngay_cap_nhat: ketQua.NgayCapNhat,
    };
  }

  async update(id: number, data: UpdateKetQuaDto) {
    const { DiemChuyenCan, DiemBaiTap, DiemKiemTra, TongDiem, XepLoai } = data;

    // Kiểm tra điểm hợp lệ
    const diemCC = DiemChuyenCan !== undefined ? Number(DiemChuyenCan) : undefined;
  const diemBT = DiemBaiTap !== undefined ? Number(DiemBaiTap) : undefined;
  const diemKT = DiemKiemTra !== undefined ? Number(DiemKiemTra) : undefined;
    const existing = await prisma.ketquahoctap.findUnique({
      where: { KetQuaHocTapID: id },
    });

    if (!existing) {
      throw new AppError('Kết quả học tập không tồn tại', 404);
    }

     // Tính lại tổng điểm
  let tong = TongDiem !== undefined ? Number(TongDiem) : undefined;
  if (tong === undefined) {
    const cc = diemCC ?? Number(existing.DiemChuyenCan ?? 0);
    const bt = diemBT ?? Number(existing.DiemBaiTap ?? 0);
    const kt = diemKT ?? Number(existing.DiemKiemTra ?? 0);
    tong = (cc + bt + kt) / 3;
    tong = Math.round(tong * 100) / 100;
  }
    // Xác định xếp loại
    let xepLoaiFinal = XepLoai;
    if (!xepLoaiFinal && tong !== undefined) {
      if (tong >= 9) xepLoaiFinal = 'XUAT_SAC';
      else if (tong >= 8) xepLoaiFinal = 'GIOI';
      else if (tong >= 6.5) xepLoaiFinal = 'KHA';
      else if (tong >= 5) xepLoaiFinal = 'TRUNG_BINH';
      else xepLoaiFinal = 'KHONG_DAT';
    }

    const ketQua = await prisma.ketquahoctap.update({
      where: { KetQuaHocTapID: id },
      data: {
        DiemChuyenCan: DiemChuyenCan ?? existing.DiemChuyenCan,
        DiemBaiTap: DiemBaiTap ?? existing.DiemBaiTap,
        DiemKiemTra: DiemKiemTra ?? existing.DiemKiemTra,
        TongDiem: tong,
        XepLoai: xepLoaiFinal || existing.XepLoai,
        NgayCapNhat: new Date(),
      },
    });

    return {
      id: ketQua.KetQuaHocTapID,
      hoc_vien_id: ketQua.HocVienID,
      lop_hoc_id: ketQua.LopHocID,
      diem_chuyen_can: ketQua.DiemChuyenCan,
      diem_bai_tap: ketQua.DiemBaiTap,
      diem_kiem_tra: ketQua.DiemKiemTra,
      tong_diem: ketQua.TongDiem,
      xep_loai: ketQua.XepLoai,
      ngay_cap_nhat: ketQua.NgayCapNhat,
    };
  }

  async delete(id: number) {
    const existing = await prisma.ketquahoctap.findUnique({
      where: { KetQuaHocTapID: id },
    });

    if (!existing) {
      throw new AppError('Kết quả học tập không tồn tại', 404);
    }

    await prisma.ketquahoctap.delete({
      where: { KetQuaHocTapID: id },
    });

    return {
      id: existing.KetQuaHocTapID,
      message: 'Xóa kết quả học tập thành công',
    };
  }

  // =============================================
  // TIẾN ĐỘ HỌC TẬP
  // =============================================

  async getTienDoList(query: TienDoQueryDto) {
    const {
      page = 1,
      limit = 10,
      hocVien,
      lopHoc,
      phanBaiHoc,
      status = 'ALL',
      sort_by = 'CreatedAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (hocVien) {
      where.HocVienID = hocVien;
    }

    if (lopHoc) {
      where.LopHocID = lopHoc;
    }

    if (phanBaiHoc) {
      where.PhanBaiHocID = phanBaiHoc;
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const total_items = await prisma.tiendohoctap.count({ where });
    const total_pages = Math.ceil(total_items / limit);

    const orderBy: any = {};
    const sortFieldMap: Record<string, string> = {
      CreatedAt: 'CreatedAt',
      TongSoCauHoiDung: 'TongSoCauHoiDung',
      TongSoCauHoi: 'TongSoCauHoi',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    orderBy[sortField] = order;

    const data = await prisma.tiendohoctap.findMany({
      where,
      include: {
        hocvien: {
          include: {
            taikhoan: {
              select: {
                HoVaTen: true,
                Email: true,
              },
            },
          },
        },
        lophoc: {
          select: {
            TenLopHoc: true,
          },
        },
        phanbaihoc: {
          select: {
            PhanBaiHocID: true,
            TenPhanBaiHoc: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      hoc_vien_id: item.HocVienID,
      ho_va_ten: item.hocvien?.taikhoan?.HoVaTen || null,
      lop_hoc_id: item.LopHocID,
      ten_lop_hoc: item.lophoc?.TenLopHoc || null,
      phan_bai_hoc_id: item.PhanBaiHocID,
      ten_phan_bai_hoc: item.phanbaihoc?.TenPhanBaiHoc || null,
     tong_so_cau_hoi: item.TongSoCauHoi ?? 0,  //  Fix: dùng nullish coalescing
    tong_so_cau_hoi_dung: item.TongSoCauHoiDung ?? 0,  //  Fix: dùng nullish coalescing
      ti_le_hoan_thanh: item.TongSoCauHoi && item.TongSoCauHoi > 0
        ? Math.round((item.TongSoCauHoiDung??0 / item.TongSoCauHoi) * 100)
        : 0,
      trang_thai: item.TrangThai,
      ngay_bat_dau: item.NgayBatDau,
      ngay_hoan_thanh: item.NgayHoanThanh,
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

  async getTienDoByHocVienAndLopHoc(hocVienId: number, lopHocId: number) {
    const data = await prisma.tiendohoctap.findMany({
      where: {
        HocVienID: hocVienId,
        LopHocID: lopHocId,
      },
      include: {
        phanbaihoc: {
          select: {
            PhanBaiHocID: true,
            TenPhanBaiHoc: true,
            TieuDe: true,
          },
        },
      },
      orderBy: {
        CreatedAt: 'asc',
      },
    });

    return data.map((item) => ({
      phan_bai_hoc_id: item.PhanBaiHocID,
      ten_phan_bai_hoc: item.phanbaihoc?.TenPhanBaiHoc || null,
      tieu_de: item.phanbaihoc?.TieuDe || null,
      tong_so_cau_hoi: item.TongSoCauHoi,
      tong_so_cau_hoi_dung: item.TongSoCauHoiDung,
      ti_le_hoan_thanh: item.TongSoCauHoi && item.TongSoCauHoi > 0
        ? Math.round((item.TongSoCauHoiDung??0 / item.TongSoCauHoi) * 100)
        : 0,
      trang_thai: item.TrangThai,
      ngay_bat_dau: item.NgayBatDau,
      ngay_hoan_thanh: item.NgayHoanThanh,
    }));
  }

  async getTienDoStatusOptions() {
    return [
      { value: 'CHUA_BAT_DAU', label: 'Chưa bắt đầu' },
      { value: 'DANG_HOC', label: 'Đang học' },
      { value: 'HOAN_THANH', label: 'Hoàn thành' },
    ];
  }

  async updateTienDo(hocVienId: number, lopHocId: number, phanBaiHocId: number) {
    // Kiểm tra tồn tại
    const existing = await prisma.tiendohoctap.findFirst({
      where: {
        HocVienID: hocVienId,
        LopHocID: lopHocId,
        PhanBaiHocID: phanBaiHocId,
      },
    });

    if (!existing) {
      throw new AppError('Tiến độ học tập không tồn tại', 404);
    }

    // Lấy số câu hỏi của phần bài học
    const cauHoiIds = await prisma.phanbaihoc_cauhoi.findMany({
      where: { PhanBaiHocID: phanBaiHocId },
      select: { CauHoiID: true },
    });

    const cauHoiIdList = cauHoiIds.map((item) => item.CauHoiID);

    // Lấy số câu hỏi đúng từ bài làm
    let tongSoCauHoiDung = 0;
    if (cauHoiIdList.length > 0) {
      const baiLamChiTiets = await prisma.bailam_chitiet.findMany({
        where: {
          CauHoiID: { in: cauHoiIdList },
          bailam: {
            HocVienID: hocVienId,
            LopHocID: lopHocId,
          },
        },
      });

      tongSoCauHoiDung = baiLamChiTiets.filter((item) => item.LaDung === true).length;
    }

    const tongSoCauHoi = cauHoiIdList.length;

    // Xác định trạng thái
    let trangThai = existing.TrangThai;
    let ngayBatDau = existing.NgayBatDau;
    let ngayHoanThanh = existing.NgayHoanThanh;

    if (tongSoCauHoiDung > 0 && !ngayBatDau) {
      ngayBatDau = new Date();
    }

    if (tongSoCauHoi > 0 && tongSoCauHoiDung >= tongSoCauHoi) {
      trangThai = 'HOAN_THANH';
      ngayHoanThanh = new Date();
    } else if (tongSoCauHoiDung > 0) {
      trangThai = 'DANG_HOC';
    } else {
      trangThai = 'CHUA_BAT_DAU';
    }

    const tienDo = await prisma.tiendohoctap.update({
      where: {
        HocVienID_LopHocID_PhanBaiHocID: {
          HocVienID: hocVienId,
          LopHocID: lopHocId,
          PhanBaiHocID: phanBaiHocId,
        },
      },
      data: {
        TongSoCauHoi: tongSoCauHoi,
        TongSoCauHoiDung: tongSoCauHoiDung,
        TrangThai: trangThai,
        NgayBatDau: ngayBatDau,
        NgayHoanThanh: ngayHoanThanh,
      },
    });

    return {
      phan_bai_hoc_id: tienDo.PhanBaiHocID,
      tong_so_cau_hoi: tienDo.TongSoCauHoi,
      tong_so_cau_hoi_dung: tienDo.TongSoCauHoiDung,
      ti_le_hoan_thanh: tienDo.TongSoCauHoi && tienDo.TongSoCauHoi > 0
        ? Math.round((tienDo.TongSoCauHoiDung??0 / tienDo.TongSoCauHoi) * 100)
        : 0,
      trang_thai: tienDo.TrangThai,
      ngay_bat_dau: tienDo.NgayBatDau,
      ngay_hoan_thanh: tienDo.NgayHoanThanh,
      updated_at: tienDo.UpdatedAt,
    };
  }
}