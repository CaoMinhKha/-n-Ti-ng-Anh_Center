// src/modules/lichhoc/dto/update-lichhoc.dto.ts

export interface UpdateLichHocDto {
  LopHocID?: number;
  ThuTrongTuan?: number; //  Thay đổi từ 1 | 2 | ... thành number
  CaHocID?: number;
  PhongHocID?: number | null;
  NgayApDung?: Date;
  NgayKetThuc?: Date;
  TrangThai?: 'HOAT_DONG' | 'TAM_DUNG';
}

export interface UpdateLichHocResponse {
  LichHocID: number;
  LopHocID: number;
  ThuTrongTuan: number;
  CaHocID: number;
  PhongHocID: number | null;
  NgayApDung: Date;
  NgayKetThuc: Date;
  TrangThai: string;
  UpdatedAt: Date;
}