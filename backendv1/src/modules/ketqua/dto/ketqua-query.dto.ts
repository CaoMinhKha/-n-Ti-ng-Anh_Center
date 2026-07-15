// src/modules/ketqua/dto/ketqua-query.dto.ts

export interface KetQuaQueryDto {
  page?: number;
  limit?: number;
  hocVien?: number;
  lopHoc?: number;
  xepLoai?: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'TRUNG_BINH' | 'KHONG_DAT' | 'ALL';
  sort_by?: 'CreatedAt' | 'TongDiem' | 'DiemChuyenCan' | 'DiemBaiTap' | 'DiemKiemTra';
  order?: 'asc' | 'desc';
}

export interface KetQuaListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}