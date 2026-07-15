// src/modules/ketqua/dto/tiendo-query.dto.ts

export interface TienDoQueryDto {
  page?: number;
  limit?: number;
  hocVien?: number;
  lopHoc?: number;
  phanBaiHoc?: number;
  status?: 'CHUA_BAT_DAU' | 'DANG_HOC' | 'HOAN_THANH' | 'ALL';
  sort_by?: 'CreatedAt' | 'TongSoCauHoiDung' | 'TongSoCauHoi';
  order?: 'asc' | 'desc';
}

export interface TienDoListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}