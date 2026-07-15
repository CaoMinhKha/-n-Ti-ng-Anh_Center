/*
  Warnings:

  - You are about to drop the `phanbaihoc_cauhoi` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `phanbaihoc_cauhoi` DROP FOREIGN KEY `phanbaihoc_cauhoi_CauHoiID_fkey`;

-- DropForeignKey
ALTER TABLE `phanbaihoc_cauhoi` DROP FOREIGN KEY `phanbaihoc_cauhoi_PhanBaiHocID_fkey`;

-- AlterTable
ALTER TABLE `cauhoi` ADD COLUMN `phanbaihocID` INTEGER NULL;

-- DropTable
DROP TABLE `phanbaihoc_cauhoi`;

-- AddForeignKey
ALTER TABLE `cauhoi` ADD CONSTRAINT `cauhoi_phanbaihocID_fkey` FOREIGN KEY (`phanbaihocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE SET NULL ON UPDATE CASCADE;
