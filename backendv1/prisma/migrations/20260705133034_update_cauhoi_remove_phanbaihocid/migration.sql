/*
  Warnings:

  - You are about to drop the column `PhanBaiHocID` on the `cauhoi` table. All the data in the column will be lost.
  - Made the column `TrangThai` on table `cauhoi` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `cauhoi` DROP FOREIGN KEY `FK_CauHoi_PhanBaiHoc`;

-- DropIndex
DROP INDEX `IDX_CauHoi_PhanBaiHoc` ON `cauhoi`;

-- AlterTable
ALTER TABLE `cauhoi` DROP COLUMN `PhanBaiHocID`,
    ADD COLUMN `phanbaihocPhanBaiHocID` INTEGER NULL,
    MODIFY `LoaiCauHoi` ENUM('TRAC_NGHIEM_MOT_DAP_AN', 'DUNG_SAI', 'TRAC_NGHIEM_NHIEU_DAP_AN', 'DIEN_VAO_CHO_TRONG', 'NOI_CAP', 'SAP_XEP', 'PHAN_LOAI') NOT NULL DEFAULT 'TRAC_NGHIEM_MOT_DAP_AN',
    MODIFY `TrangThai` ENUM('AN', 'HIEN') NOT NULL DEFAULT 'HIEN';

-- CreateTable
CREATE TABLE `phanbaihoc_cauhoi` (
    `PhanBaiHocID` INTEGER NOT NULL,
    `CauHoiID` INTEGER NOT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,

    INDEX `phanbaihoc_cauhoi_CauHoiID_idx`(`CauHoiID`),
    INDEX `phanbaihoc_cauhoi_PhanBaiHocID_idx`(`PhanBaiHocID`),
    PRIMARY KEY (`PhanBaiHocID`, `CauHoiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `cauhoi_TrangThai_idx` ON `cauhoi`(`TrangThai`);

-- CreateIndex
CREATE INDEX `cauhoi_LoaiCauHoi_idx` ON `cauhoi`(`LoaiCauHoi`);

-- AddForeignKey
ALTER TABLE `cauhoi` ADD CONSTRAINT `cauhoi_phanbaihocPhanBaiHocID_fkey` FOREIGN KEY (`phanbaihocPhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanbaihoc_cauhoi` ADD CONSTRAINT `phanbaihoc_cauhoi_PhanBaiHocID_fkey` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanbaihoc_cauhoi` ADD CONSTRAINT `phanbaihoc_cauhoi_CauHoiID_fkey` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;
