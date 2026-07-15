// src/modules/diemdanh/dto/diemdanh-query.dto.ts

export interface DiemDanhQueryDto {
  page: number;
  limit: number;
  buoiHoc?: number;
  hocVien?: number;
  status: 'CO_MAT' | 'VANG_CO_PHEP' | 'VANG_KHONG_PHEP' | 'DI_MUON' | 'ALL';
  sort_by: 'CreatedAt' | 'ThoiGianCheckIn';
  order: 'asc' | 'desc';
}

export interface DiemDanhListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}