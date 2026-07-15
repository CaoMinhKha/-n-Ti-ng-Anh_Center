// src/modules/lichhoc/dto/create-lichhoc.dto.ts

export interface CreateLichHocDto {
  LopHocID: number;
  ThuTrongTuan: number; //  Thay đổi từ 1 | 2 | ... thành number
  CaHocID: number;
  PhongHocID?: number | null;
  NgayApDung: Date;
  NgayKetThuc: Date;
  TrangThai?: 'HOAT_DONG' | 'TAM_DUNG';
}

export interface CreateLichHocResponse {
  LichHocID: number;
  LopHocID: number;
  ThuTrongTuan: number;
  CaHocID: number;
  PhongHocID: number | null;
  NgayApDung: Date;
  NgayKetThuc: Date;
  TrangThai: string;
  CreatedAt: Date;
}