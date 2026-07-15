/*
  Warnings:

  - You are about to drop the column `LoaiPhanBaiHoc` on the `phanbaihoc` table. All the data in the column will be lost.
  - Added the required column `LoaiPhanBaiHocID` to the `phanbaihoc` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `phanbaihoc` DROP COLUMN `LoaiPhanBaiHoc`,
    ADD COLUMN `LoaiPhanBaiHocID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `phanbaihoc` ADD CONSTRAINT `FK_PhanBaiHoc_DanhMuc` FOREIGN KEY (`LoaiPhanBaiHocID`) REFERENCES `danhmuc`(`DanhMucID`) ON DELETE RESTRICT ON UPDATE CASCADE;
