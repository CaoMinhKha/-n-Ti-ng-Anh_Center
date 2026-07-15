// src/modules/cauhoi/services/cauhoi.service.ts

import { prisma } from '../../../config/prisma.js';
import { AppError } from '../../../middleware/error.middleware.js';
import { CreateCauHoiDto, UpdateCauHoiDto, CauHoiQueryDto } from '../dto/index.js';

export class CauHoiService {
  /**
   * Lấy danh sách câu hỏi (phân trang, tìm kiếm, lọc, sắp xếp)
   */
  async getList(query: CauHoiQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      loai,
      status = 'ALL',
      sort_by = 'createdAt',
      order = 'desc',
    } = query;

    const where: any = {};

    if (search) {
      where.OR = [
        { NoiDungText: { contains: search } },
        { TieuDe: { contains: search } },
      ];
    }

    if (loai) {
      where.LoaiCauHoi = loai;
    }

    if (status && status !== 'ALL') {
      where.TrangThai = status;
    }

    const totalItems = await prisma.cauhoi.count({ where });
    const totalPages = Math.ceil(totalItems / limit);

    const sortFieldMap: Record<string, string> = {
      createdAt: 'CreatedAt',
      loaiCauHoi: 'LoaiCauHoi',
      noiDungText: 'NoiDungText',
      thuTuHienThi: 'ThuTuHienThi',
    };
    const sortField = sortFieldMap[sort_by] || 'CreatedAt';
    const orderBy: any = { [sortField]: order };

    const data = await prisma.cauhoi.findMany({
      where,
      include: {
        cauHoiCha: {
          select: {
            CauHoiID: true,
            NoiDungText: true,
          },
        },
        _count: {
          select: {
            dapan: true,
            cauHoiCon: true,
          },
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = data.map((item) => ({
      cauHoiID: item.CauHoiID,
      loaiCauHoi: item.LoaiCauHoi,
      cauHoiChaID: item.CauHoiChaID,
      cauHoiCha: item.cauHoiCha?.NoiDungText || null,
      tieuDe: item.TieuDe,
      noiDungText: item.NoiDungText,
      noiDungUrl: item.NoiDungUrl,
      duLieuPhu: item.DuLieuPhu,
      thuTuHienThi: item.ThuTuHienThi,
      trangThai: item.TrangThai,
      soLuongDapAn: item._count.dapan,
      soLuongCauHoiCon: item._count.cauHoiCon,
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
   * Lấy danh sách loại câu hỏi (dropdown)
   */
  async getTypes() {
    return [
      { value: 'TRAC_NGHIEM_MOT_DAP_AN', label: 'Trắc nghiệm 1 đáp án' },
      { value: 'DUNG_SAI', label: 'Đúng/Sai' },
      { value: 'TRAC_NGHIEM_NHIEU_DAP_AN', label: 'Trắc nghiệm nhiều đáp án' },
      { value: 'DIEN_VAO_CHO_TRONG', label: 'Điền vào chỗ trống' },
      { value: 'NOI_CAP', label: 'Nối cặp' },
      { value: 'SAP_XEP', label: 'Sắp xếp' },
      { value: 'PHAN_LOAI', label: 'Phân loại' },
      { value: 'DOC_HIEU', label: 'Đọc hiểu' },
      { value: 'NGHE_HIEU', label: 'Nghe hiểu' },
      { value: 'XEM_HINH', label: 'Xem hình' },
      { value: 'TINH_HUONG', label: 'Tình huống' },
    ];
  }

  /**
   * Lấy danh sách trạng thái (dropdown)
   */
  async getStatusOptions() {
    return [
      { value: 'HIEN', label: 'Hiển thị' },
      { value: 'AN', label: 'Ẩn' },
    ];
  }

  /**
   * Lấy danh sách câu hỏi (dropdown)
   */
  async getOptions() {
    const cauHois = await prisma.cauhoi.findMany({
      where: {
        TrangThai: 'HIEN',
        CauHoiChaID: null,
      },
      orderBy: {
        ThuTuHienThi: 'asc',
      },
    });

    return cauHois.map((item) => ({
      value: item.CauHoiID,
      label: item.NoiDungText ? item.NoiDungText.substring(0, 50) + '...' : `Câu hỏi ${item.CauHoiID}`,
    }));
  }

  /**
   * Lấy danh sách câu hỏi con của câu hỏi cha
   */
  async getChildren(parentId: number) {
    const parent = await prisma.cauhoi.findUnique({
      where: { CauHoiID: parentId },
    });

    if (!parent) {
      throw new AppError('Câu hỏi cha không tồn tại', 404);
    }

    const children = await prisma.cauhoi.findMany({
      where: {
        CauHoiChaID: parentId,
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
        ThuTuHienThi: 'asc',
      },
    });

    return children.map((child) => ({
      cauHoiID: child.CauHoiID,
      loaiCauHoi: child.LoaiCauHoi,
      noiDungText: child.NoiDungText,
      noiDungUrl: child.NoiDungUrl,
      thuTuHienThi: child.ThuTuHienThi,
      trangThai: child.TrangThai,
      dapAn: child.dapan.map((d) => ({
        dapAnID: d.DapAnID,
        noiDungText: d.NoiDungText,
        noiDungUrl: d.NoiDungUrl,
        laDapAnDung: d.LaDapAnDung,
        thuTuHienThi: d.ThuTuHienThi,
        giaTriKhop: d.GiaTriKhop,
      })),
      createdAt: child.CreatedAt,
      updatedAt: child.UpdatedAt,
    }));
  }

  /**
   * Lấy chi tiết câu hỏi
   */
  async getById(id: number) {
    const cauHoi = await prisma.cauhoi.findUnique({
      where: { CauHoiID: id },
      include: {
        cauHoiCha: {
          select: {
            CauHoiID: true,
            NoiDungText: true,
            LoaiCauHoi: true,
          },
        },
        cauHoiCon: {
          where: {
            TrangThai: 'HIEN',
          },
          orderBy: {
            ThuTuHienThi: 'asc',
          },
          include: {
            dapan: {
              orderBy: {
                ThuTuHienThi: 'asc',
              },
            },
          },
        },
        dapan: {
          orderBy: {
            ThuTuHienThi: 'asc',
          },
        },
      },
    });

    if (!cauHoi) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    return {
      cauHoiID: cauHoi.CauHoiID,
      loaiCauHoi: cauHoi.LoaiCauHoi,
      cauHoiChaID: cauHoi.CauHoiChaID,
      cauHoiCha: cauHoi.cauHoiCha || null,
      tieuDe: cauHoi.TieuDe,
      noiDungText: cauHoi.NoiDungText,
      noiDungUrl: cauHoi.NoiDungUrl,
      duLieuPhu: cauHoi.DuLieuPhu,
      thuTuHienThi: cauHoi.ThuTuHienThi,
      trangThai: cauHoi.TrangThai,
      soLuongCauHoiCon: cauHoi.cauHoiCon.length,
      cauHoiCon: cauHoi.cauHoiCon.map((con) => ({
        cauHoiID: con.CauHoiID,
        loaiCauHoi: con.LoaiCauHoi,
        noiDungText: con.NoiDungText,
        thuTuHienThi: con.ThuTuHienThi,
        dapAn: con.dapan.map((d) => ({
          dapAnID: d.DapAnID,
          noiDungText: d.NoiDungText,
          noiDungUrl: d.NoiDungUrl,
          laDapAnDung: d.LaDapAnDung,
          thuTuHienThi: d.ThuTuHienThi,
          giaTriKhop: d.GiaTriKhop,
        })),
      })),
      dapAn: cauHoi.dapan.map((d) => ({
        dapAnID: d.DapAnID,
        noiDungText: d.NoiDungText,
        noiDungUrl: d.NoiDungUrl,
        laDapAnDung: d.LaDapAnDung,
        thuTuHienThi: d.ThuTuHienThi,
        giaTriKhop: d.GiaTriKhop,
      })),
      createdAt: cauHoi.CreatedAt,
      updatedAt: cauHoi.UpdatedAt,
    };
  }

  /**
   * Tạo câu hỏi mới
   */
  async create(data: CreateCauHoiDto) {
    const { loaiCauHoi, cauHoiChaID, tieuDe, noiDungText, noiDungUrl, duLieuPhu, thuTuHienThi, trangThai } = data;

    // Kiểm tra câu hỏi cha tồn tại
    if (cauHoiChaID) {
      const parent = await prisma.cauhoi.findUnique({
        where: { CauHoiID: cauHoiChaID },
      });

      if (!parent) {
        throw new AppError('Câu hỏi cha không tồn tại', 404);
      }

      const TYPES_CAN_HAVE_CHILDREN = ['DOC_HIEU', 'NGHE_HIEU', 'XEM_HINH', 'TINH_HUONG'];
      if (!TYPES_CAN_HAVE_CHILDREN.includes(parent.LoaiCauHoi)) {
        throw new AppError(
          `Câu hỏi cha loại ${parent.LoaiCauHoi} không thể có câu hỏi con`,
          400
        );
      }
    }

    let thuTu = thuTuHienThi;
    if (thuTu === undefined) {
      const maxOrder = await prisma.cauhoi.aggregate({
        _max: { ThuTuHienThi: true },
      });
      thuTu = (maxOrder._max.ThuTuHienThi || 0) + 1;
    }

    const cauHoi = await prisma.cauhoi.create({
      data: {
        LoaiCauHoi: loaiCauHoi,
        CauHoiChaID: cauHoiChaID || null,
        TieuDe: tieuDe || null,
        NoiDungText: noiDungText || null,
        NoiDungUrl: noiDungUrl || null,
        DuLieuPhu: duLieuPhu || null,
        ThuTuHienThi: thuTu,
        TrangThai: trangThai || 'HIEN',
      },
    });

    return {
      cauHoiID: cauHoi.CauHoiID,
      loaiCauHoi: cauHoi.LoaiCauHoi,
      cauHoiChaID: cauHoi.CauHoiChaID,
      tieuDe: cauHoi.TieuDe,
      noiDungText: cauHoi.NoiDungText,
      noiDungUrl: cauHoi.NoiDungUrl,
      duLieuPhu: cauHoi.DuLieuPhu,
      thuTuHienThi: cauHoi.ThuTuHienThi,
      trangThai: cauHoi.TrangThai,
      createdAt: cauHoi.CreatedAt,
    };
  }

  /**
   * Cập nhật câu hỏi
   */
  async update(id: number, data: UpdateCauHoiDto) {
    const { loaiCauHoi, cauHoiChaID, tieuDe, noiDungText, noiDungUrl, duLieuPhu, thuTuHienThi, trangThai } = data;

    const existing = await prisma.cauhoi.findUnique({
      where: { CauHoiID: id },
    });

    if (!existing) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    if (cauHoiChaID) {
      if (cauHoiChaID === id) {
        throw new AppError('Không thể đặt câu hỏi là cha của chính nó', 400);
      }

      const parent = await prisma.cauhoi.findUnique({
        where: { CauHoiID: cauHoiChaID },
      });

      if (!parent) {
        throw new AppError('Câu hỏi cha không tồn tại', 404);
      }

      const TYPES_CAN_HAVE_CHILDREN = ['DOC_HIEU', 'NGHE_HIEU', 'XEM_HINH', 'TINH_HUONG'];
      if (!TYPES_CAN_HAVE_CHILDREN.includes(parent.LoaiCauHoi)) {
        throw new AppError(
          `Câu hỏi cha loại ${parent.LoaiCauHoi} không thể có câu hỏi con`,
          400
        );
      }
    }

    const cauHoi = await prisma.cauhoi.update({
      where: { CauHoiID: id },
      data: {
        LoaiCauHoi: loaiCauHoi,
        CauHoiChaID: cauHoiChaID === undefined ? undefined : (cauHoiChaID || null),
        TieuDe: tieuDe === undefined ? undefined : (tieuDe || null),
        NoiDungText: noiDungText === undefined ? undefined : (noiDungText || null),
        NoiDungUrl: noiDungUrl === undefined ? undefined : (noiDungUrl || null),
        DuLieuPhu: duLieuPhu === undefined ? undefined : (duLieuPhu || null),
        ThuTuHienThi: thuTuHienThi,
        TrangThai: trangThai,
      },
    });

    return {
      cauHoiID: cauHoi.CauHoiID,
      loaiCauHoi: cauHoi.LoaiCauHoi,
      cauHoiChaID: cauHoi.CauHoiChaID,
      tieuDe: cauHoi.TieuDe,
      noiDungText: cauHoi.NoiDungText,
      noiDungUrl: cauHoi.NoiDungUrl,
      duLieuPhu: cauHoi.DuLieuPhu,
      thuTuHienThi: cauHoi.ThuTuHienThi,
      trangThai: cauHoi.TrangThai,
      updatedAt: cauHoi.UpdatedAt,
    };
  }

  /**
   * Xóa câu hỏi
   */
  async delete(id: number) {
    const existing = await prisma.cauhoi.findUnique({
      where: { CauHoiID: id },
      include: {
        cauHoiCon: {
          where: {
            TrangThai: 'HIEN',
          },
        },
        dapan: true,
        phanbaihoc_cauhoi: true,
        baikiemtra_cauhoi: true,
      },
    });

    if (!existing) {
      throw new AppError('Câu hỏi không tồn tại', 404);
    }

    if (existing.cauHoiCon.length > 0) {
      throw new AppError('Không thể xóa câu hỏi đang có câu hỏi con', 400);
    }



    if (existing.phanbaihoc_cauhoi.length > 0) {
      throw new AppError('Không thể xóa câu hỏi đang được sử dụng trong phần bài học', 400);
    }

    if (existing.baikiemtra_cauhoi.length > 0) {
      throw new AppError('Không thể xóa câu hỏi đang được sử dụng trong bài kiểm tra', 400);
    }

    await prisma.cauhoi.delete({
      where: { CauHoiID: id },
    });

    return {
      cauHoiID: existing.CauHoiID,
      message: 'Xóa câu hỏi thành công',
    };
  }
}