// src/modules/ketqua/dto/update-ketqua.dto.ts

export interface UpdateKetQuaDto {
  DiemChuyenCan?: number;
  DiemBaiTap?: number;
  DiemKiemTra?: number;
  TongDiem?: number;
  XepLoai?: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'TRUNG_BINH' | 'KHONG_DAT';
}

export interface UpdateKetQuaResponse {
  KetQuaHocTapID: number;
  HocVienID: number;
  LopHocID: number;
  DiemChuyenCan: number | null;
  DiemBaiTap: number | null;
  DiemKiemTra: number | null;
  TongDiem: number | null;
  XepLoai: string | null;
  NgayCapNhat: Date;
}