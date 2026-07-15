// src/modules/bailam/dto/update-bailam-chitiet.dto.ts

export interface UpdateBaiLamChiTietDto {
  DapAnID?: number | null;
  NoiDungTraLoi?: string | null;
  LaDung?: boolean | null;
}

export interface UpdateBaiLamChiTietResponse {
  BaiLamID: number;
  CauHoiID: number;
  DapAnID: number | null;
  NoiDungTraLoi: string | null;
  LaDung: boolean | null;
  UpdatedAt: Date;
}