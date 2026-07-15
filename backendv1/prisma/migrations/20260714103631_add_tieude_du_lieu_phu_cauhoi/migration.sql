-- DropForeignKey
ALTER TABLE `baikiemtra` DROP FOREIGN KEY `baikiemtra_PhanBaiHocID_fkey`;

-- AlterTable
ALTER TABLE `cauhoi` ADD COLUMN `DuLieuPhu` LONGTEXT NULL,
    ADD COLUMN `TieuDe` VARCHAR(255) NULL;

-- AddForeignKey
ALTER TABLE `baikiemtra` ADD CONSTRAINT `FK_BaiKiemTra_PhanBaiHoc` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE RESTRICT;
