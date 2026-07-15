/*
  Warnings:

  - You are about to drop the column `CreatedAt` on the `bailam_chitiet` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `bailam_chitiet` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `cahoc` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `cahoc` table. All the data in the column will be lost.
  - You are about to drop the column `CauHinhJson` on the `cauhoi` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `danhmuc` table. All the data in the column will be lost.
  - You are about to drop the column `IsDeleted` on the `danhmuc` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `danhmuc` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `dapan` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `dapan` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `hocvien_diemdanh` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `hocvien_diemdanh` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `hocvien_lophoc` table. All the data in the column will be lost.
  - You are about to drop the column `CreatedAt` on the `phonghoc` table. All the data in the column will be lost.
  - You are about to drop the column `UpdatedAt` on the `phonghoc` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `baikiemtra` DROP FOREIGN KEY `FK_BaiKiemTra_PhanBaiHoc`;

-- DropForeignKey
ALTER TABLE `dapan` DROP FOREIGN KEY `FK_DapAn_CauHoi`;

-- DropIndex
DROP INDEX `baikiemtra_PhanBaiHocID_key` ON `baikiemtra`;

-- DropIndex
DROP INDEX `lophoc_TenLopHoc_key` ON `lophoc`;

-- AlterTable
ALTER TABLE `bailam_chitiet` DROP COLUMN `CreatedAt`,
    DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `cahoc` DROP COLUMN `CreatedAt`,
    DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `cauhoi` DROP COLUMN `CauHinhJson`,
    ADD COLUMN `CauHoiChaID` INTEGER NULL,
    ADD COLUMN `phanbaihocPhanBaiHocID` INTEGER NULL,
    MODIFY `LoaiCauHoi` ENUM('TRAC_NGHIEM_MOT_DAP_AN', 'DUNG_SAI', 'TRAC_NGHIEM_NHIEU_DAP_AN', 'DIEN_VAO_CHO_TRONG', 'NOI_CAP', 'SAP_XEP', 'PHAN_LOAI', 'DOC_HIEU', 'NGHE_HIEU', 'XEM_HINH', 'TINH_HUONG') NOT NULL DEFAULT 'TRAC_NGHIEM_MOT_DAP_AN';

-- AlterTable
ALTER TABLE `danhmuc` DROP COLUMN `CreatedAt`,
    DROP COLUMN `IsDeleted`,
    DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `dapan` DROP COLUMN `CreatedAt`,
    DROP COLUMN `UpdatedAt`,
    ADD COLUMN `GiaTriKhop` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `hocvien_diemdanh` DROP COLUMN `CreatedAt`,
    DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `hocvien_lophoc` DROP COLUMN `UpdatedAt`;

-- AlterTable
ALTER TABLE `phonghoc` DROP COLUMN `CreatedAt`,
    DROP COLUMN `UpdatedAt`;

-- CreateIndex
CREATE INDEX `cauhoi_CauHoiChaID_idx` ON `cauhoi`(`CauHoiChaID`);

-- CreateIndex
CREATE INDEX `cauhoi_phanbaihocPhanBaiHocID_fkey` ON `cauhoi`(`phanbaihocPhanBaiHocID`);

-- AddForeignKey
ALTER TABLE `baikiemtra` ADD CONSTRAINT `FK_BaiKiemTra_PhanBaiHoc` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cauhoi` ADD CONSTRAINT `cauhoi_CauHoiChaID_fkey` FOREIGN KEY (`CauHoiChaID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cauhoi` ADD CONSTRAINT `cauhoi_phanbaihocPhanBaiHocID_fkey` FOREIGN KEY (`phanbaihocPhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapan` ADD CONSTRAINT `dapan_CauHoiID_fkey` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;
