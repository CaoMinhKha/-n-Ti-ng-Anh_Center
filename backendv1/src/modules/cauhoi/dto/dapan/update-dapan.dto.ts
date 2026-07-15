// src/modules/cauhoi/dto/dapan/update-dapan.dto.ts

export interface UpdateDapAnDto {
  noiDungText?: string;
  noiDungUrl?: string | null;
  laDapAnDung?: boolean;
  thuTuHienThi?: number;
  giaTriKhop?: string | null;
}

export interface UpdateDapAnResponse {
  dapAnID: number;
  cauHoiID: number;
  noiDungText: string;
  noiDungUrl: string | null;
  laDapAnDung: boolean;
  thuTuHienThi: number;
  giaTriKhop: string | null;
  updatedAt: Date;
}