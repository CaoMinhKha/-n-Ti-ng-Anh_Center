// src/modules/lichhoc/dto/phonghoc-query.dto.ts

export interface PhongHocQueryDto {
  page: number;
  limit: number;
  search?: string;
  status: 'TRONG' | 'DANG_SU_DUNG' | 'BAO_TRI' | 'ALL';
  sort_by: 'CreatedAt' | 'MaPhong' | 'TenPhong' | 'SucChua';
  order: 'asc' | 'desc';
}

export interface PhongHocListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}