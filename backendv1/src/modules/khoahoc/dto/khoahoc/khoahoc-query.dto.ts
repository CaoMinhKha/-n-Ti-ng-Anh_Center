// src/modules/khoahoc/dto/khoahoc/khoahoc-query.dto.ts

export interface KhoaHocQueryDto {
  page: number;
  limit: number;
  search?: string;
  trinhDo?: string;
  status: 'SAP_MO' | 'DANG_MO' | 'TAM_DUNG' | 'ALL';
  sort_by: 'createdAt' | 'tenKhoaHoc' | 'hocPhi' | 'trangThai';
  order: 'asc' | 'desc';
}

export interface KhoaHocListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: any[];
}