/*
  Warnings:

  - A unique constraint covering the columns `[PhanBaiHocID]` on the table `baikiemtra` will be added.
  - A unique constraint covering the columns `[TenLopHoc]` on the table `lophoc` will be added.
*/


-- DropForeignKey
ALTER TABLE `baikiemtra`
DROP FOREIGN KEY `FK_BaiKiemTra_PhanBaiHoc`;


-- Create Unique Index cho bài kiểm tra
CREATE UNIQUE INDEX `baikiemtra_PhanBaiHocID_key`
ON `baikiemtra`(`PhanBaiHocID`);


-- Create Unique Index cho lớp học
CREATE UNIQUE INDEX `lophoc_TenLopHoc_key`
ON `lophoc`(`TenLopHoc`);


-- Add lại Foreign Key
ALTER TABLE `baikiemtra`
ADD CONSTRAINT `baikiemtra_PhanBaiHocID_fkey`
FOREIGN KEY (`PhanBaiHocID`)
REFERENCES `phanbaihoc`(`PhanBaiHocID`)
ON DELETE CASCADE