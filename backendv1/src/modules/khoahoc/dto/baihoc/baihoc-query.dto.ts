// src/modules/khoahoc/dto/baihoc/baihoc-query.dto.ts

export interface BaiHocQueryDto {
  page: number;
  limit: number;
  search?: string;
  status: 'AN' | 'HIEN' | 'ALL';
  sort_by: 'createdAt' | 'tenBaiHoc' | 'thuTuHienThi';
  order: 'asc' | 'desc';
}

export interface BaiHocListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: any[];
}