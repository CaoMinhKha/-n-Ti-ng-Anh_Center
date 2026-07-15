// src/modules/lophoc/dto/update-lophoc.dto.ts

export interface UpdateLopHocDto {
  DotKhaiGiangID?: number;
  KhoaHocID?: number;
  GiaoVienID?: number;
  TenLopHoc?: string;
  HinhThucHoc?: 'ONLLINE' | 'OFFLINE';
  HocPhi?: number;
  SiSoToiDa?: number;
  NgayBatDau?: Date;
  NgayKetThuc?: Date;
  TrangThai?: 'SAP_KHAI_GIANG' | 'DANG_HOC' | 'DA_KET_THUC' | 'DA_HUY';
}

export interface UpdateLopHocResponse {
  LopHocID: number;
  TenLopHoc: string;
  HinhThucHoc: string;
  HocPhi: number | null;
  SiSoToiDa: number;
  NgayBatDau: Date;
  NgayKetThuc: Date;
  TrangThai: string;
  UpdatedAt: Date;
}