// src/modules/ketqua/dto/create-ketqua.dto.ts

export interface CreateKetQuaDto {
  HocVienID: number;
  LopHocID: number;
  DiemChuyenCan?: number;
  DiemBaiTap?: number;
  DiemKiemTra?: number;
  TongDiem?: number;
  XepLoai?: 'XUAT_SAC' | 'GIOI' | 'KHA' | 'TRUNG_BINH' | 'KHONG_DAT';
}

export interface CreateKetQuaResponse {
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