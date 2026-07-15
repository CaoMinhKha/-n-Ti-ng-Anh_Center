// src/modules/lophoc/dto/lophoc-query.dto.ts

export interface LopHocQueryDto {
  page: number;
  limit: number;
  search?: string;
  dotKhaiGiang?: number;
  khoaHoc?: number;
  giaoVien?: number;
  hinhThucHoc?: 'ONLLINE' | 'OFFLINE';
  status: 'SAP_KHAI_GIANG' | 'DANG_HOC' | 'DA_KET_THUC' | 'DA_HUY' | 'ALL';
  sort_by: 'CreatedAt' | 'TenLopHoc' | 'NgayBatDau' | 'NgayKetThuc';
  order: 'asc' | 'desc';
}

export interface LopHocListResponse {
  total_items: number;
  total_pages: number;
  current_page: number;
  limit: number;
  data: any[];
}