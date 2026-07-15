// src/modules/danhmuc/dto/create-danhmuc.dto.ts

export interface CreateDanhMucDto {
  tenDanhMuc: string;
  moTa?: string;
  thuTuHienThi?: number;
  danhMucChaId?: number | null;
  trangThai?: 'HOAT_DONG' | 'NGUNG_HOAT_DONG';
}

export interface CreateDanhMucResponse {
  id: number;
  tenDanhMuc: string;
  moTa: string | null;
  thuTuHienThi: number;
  trangThai: string;
  parentId: number | null;
  createdAt: Date;
}