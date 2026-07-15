// src/modules/cauhoi/dto/cauhoi/cauhoi-query.dto.ts

export interface CauHoiQueryDto {
  page: number;
  limit: number;
  search?: string;
  loai?: string;
  status: 'AN' | 'HIEN' | 'ALL';
  sort_by: 'createdAt' | 'loaiCauHoi' | 'noiDungText' | 'thuTuHienThi';
  order: 'asc' | 'desc';
}

export interface CauHoiListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: any[];
}