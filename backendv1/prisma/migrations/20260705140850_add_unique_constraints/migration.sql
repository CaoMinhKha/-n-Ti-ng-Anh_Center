/*
  Warnings:

  - A unique constraint covering the columns `[KhoaHocID,TenBaiHoc]` on the table `baihoc` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[TenKhoaHoc]` on the table `khoahoc` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `baihoc_KhoaHocID_TenBaiHoc_key` ON `baihoc`(`KhoaHocID`, `TenBaiHoc`);

-- CreateIndex
CREATE UNIQUE INDEX `khoahoc_TenKhoaHoc_key` ON `khoahoc`(`TenKhoaHoc`);
