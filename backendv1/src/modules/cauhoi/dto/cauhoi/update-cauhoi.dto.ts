// src/modules/cauhoi/dto/cauhoi/update-cauhoi.dto.ts

export interface UpdateCauHoiDto {
  loaiCauHoi?: 'TRAC_NGHIEM_MOT_DAP_AN' | 'DUNG_SAI' | 'TRAC_NGHIEM_NHIEU_DAP_AN' |
    'DIEN_VAO_CHO_TRONG' | 'NOI_CAP' | 'SAP_XEP' | 'PHAN_LOAI' |
    'DOC_HIEU' | 'NGHE_HIEU' | 'XEM_HINH' | 'TINH_HUONG';
  cauHoiChaID?: number | null;
  tieuDe?: string | null;
  noiDungText?: string | null;
  noiDungUrl?: string | null;
  duLieuPhu?: any | null;
  thuTuHienThi?: number;
  trangThai?: 'AN' | 'HIEN';
}

export interface UpdateCauHoiResponse {
  cauHoiID: number;
  loaiCauHoi: string;
  cauHoiChaID: number | null;
  tieuDe: string | null;
  noiDungText: string | null;
  noiDungUrl: string | null;
  duLieuPhu: any | null;
  thuTuHienThi: number;
  trangThai: string;
  updatedAt: Date;
}