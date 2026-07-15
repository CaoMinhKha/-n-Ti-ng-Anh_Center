// src/modules/khoahoc/dto/common/update-order.dto.ts

export interface UpdateBaiHocOrderDto {
  orders: {
    baiHocID: number;
    thuTuHienThi: number;
  }[];
}

export interface UpdatePhanBaiHocOrderDto {
  orders: {
    phanBaiHocID: number;
    thuTuHienThi: number;
  }[];
}

export interface UpdateOrderResponse {
  message: string;
  updated: number;
}