// src/modules/cauhoi/dto/dapan/create-dapan.dto.ts

export interface CreateDapAnDto {
  noiDungText: string;
  noiDungUrl?: string | null;
  laDapAnDung?: boolean;
  thuTuHienThi?: number;
  giaTriKhop?: string | null;
}

export interface CreateDapAnResponse {
  dapAnID: number;
  cauHoiID: number;
  noiDungText: string;
  noiDungUrl: string | null;
  laDapAnDung: boolean;
  thuTuHienThi: number;
  giaTriKhop: string | null;
  createdAt: Date;
}