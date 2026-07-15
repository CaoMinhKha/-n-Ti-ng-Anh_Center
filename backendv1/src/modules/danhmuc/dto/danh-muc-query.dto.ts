// src/modules/danhmuc/dto/danh-muc-query.dto.ts

export interface DanhMucQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: 'HOAT_DONG' | 'NGUNG_HOAT_DONG' | 'ALL';
  sort_by?: 'createdAt' | 'tenDanhMuc' | 'thuTuHienThi' | 'updatedAt';
  order?: 'asc' | 'desc';
}

export interface DanhMucListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: any[];
}