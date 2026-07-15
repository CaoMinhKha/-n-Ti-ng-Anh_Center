// src/modules/taikhoan/dto/taikhoan-query.dto.ts

export interface TaiKhoanQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'ADMIN' | 'GIAO_VIEN' | 'HOC_VIEN' | 'ALL';
  status?: 'HOAT_DONG' | 'KHOA' | 'CHO_XAC_THUC' | 'ALL';
  sort_by?: 'createdAt' | 'email' | 'hoVaTen' | 'vaiTro' | 'trangThai';
  order?: 'asc' | 'desc';
}

export interface TaiKhoanListResponse {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  data: any[];
}