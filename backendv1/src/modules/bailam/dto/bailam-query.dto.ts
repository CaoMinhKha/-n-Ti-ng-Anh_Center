// src/modules/bailam/dto/bailam-query.dto.ts

export interface BaiLamQueryDto {
  page: number;
  limit: number;
  baiKiemTra?: number;
  hocVien?: number;
  lopHoc?: number;
  status: 'DANG_LAM' | 'DA_NOP' | 'HET_GIO' | 'ALL';
  sort_by: 'CreatedAt' | 'ThoiGianNop' | 'TongDiem';
  order: 'asc' | 'desc';
}

export interface BaiLamListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}