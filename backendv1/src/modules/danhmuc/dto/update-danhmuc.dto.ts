// src/modules/danhmuc/dto/update-danhmuc.dto.ts

export interface UpdateDanhMucDto {
  tenDanhMuc?: string;
  moTa?: string;
  thuTuHienThi?: number;
  danhMucChaId?: number | null;
  trangThai?: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
}

export interface UpdateDanhMucResponse {
  id: number;
  tenDanhMuc: string;
  moTa: string | null;
  thuTuHienThi: number;
  trangThai: string;
  parentId: number | null;
  updatedAt: Date;
}