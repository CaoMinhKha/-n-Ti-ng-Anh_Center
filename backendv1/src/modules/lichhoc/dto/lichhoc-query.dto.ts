// src/modules/lichhoc/dto/lichhoc-query.dto.ts

export interface LichHocQueryDto {
  page: number;
  limit: number;
  lopHoc?: number;
  caHoc?: number;
  thuTrongTuan?: number;
  status: 'HOAT_DONG' | 'TAM_DUNG' | 'ALL';
  sort_by: 'CreatedAt' | 'ThuTrongTuan' | 'NgayApDung' | 'NgayKetThuc';
  order: 'asc' | 'desc';
}

export interface LichHocListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}