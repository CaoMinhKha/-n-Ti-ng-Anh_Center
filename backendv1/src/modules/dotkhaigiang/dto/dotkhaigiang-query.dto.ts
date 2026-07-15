// src/modules/dotkhaigiang/dto/dotkhaigiang-query.dto.ts

export interface DotKhaiGiangQueryDto {
  page: number;
  limit: number;
  search?: string;
  status: 'SAP_MO' | 'DANG_MO' | 'DA_DONG' | 'ALL';
  sort_by: 'CreatedAt' | 'MaDot' | 'TenDot' | 'NgayMoDangKy';
  order: 'asc' | 'desc';
}

export interface DotKhaiGiangListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}