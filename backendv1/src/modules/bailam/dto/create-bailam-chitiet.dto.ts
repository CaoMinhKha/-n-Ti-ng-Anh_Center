// src/modules/bailam/dto/create-bailam-chitiet.dto.ts

export interface CreateBaiLamChiTietDto {
  CauHoiID: number;
  DapAnID?: number | null;
  NoiDungTraLoi?: string | null;
  LaDung?: boolean | null;
}

export interface CreateBaiLamChiTietResponse {
  BaiLamID: number;
  CauHoiID: number;
  DapAnID: number | null;
  NoiDungTraLoi: string | null;
  LaDung: boolean | null;
}