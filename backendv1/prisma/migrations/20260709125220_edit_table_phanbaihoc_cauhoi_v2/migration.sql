/*
  Warnings:

  - You are about to drop the column `phanbaihocID` on the `cauhoi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cauhoi` DROP FOREIGN KEY `cauhoi_phanbaihocID_fkey`;

-- DropIndex
DROP INDEX `cauhoi_phanbaihocID_fkey` ON `cauhoi`;

-- AlterTable
ALTER TABLE `cauhoi` DROP COLUMN `phanbaihocID`;

-- CreateTable
CREATE TABLE `phanbaihoc_cauhoi` (
    `PhanBaiHocID` INTEGER NOT NULL,
    `CauHoiID` INTEGER NOT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,

    INDEX `phanbaihoc_cauhoi_CauHoiID_idx`(`CauHoiID`),
    INDEX `phanbaihoc_cauhoi_PhanBaiHocID_idx`(`PhanBaiHocID`),
    PRIMARY KEY (`PhanBaiHocID`, `CauHoiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `phanbaihoc_cauhoi` ADD CONSTRAINT `phanbaihoc_cauhoi_PhanBaiHocID_fkey` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanbaihoc_cauhoi` ADD CONSTRAINT `phanbaihoc_cauhoi_CauHoiID_fkey` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;
