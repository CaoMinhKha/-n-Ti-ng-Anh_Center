/*
  Warnings:

  - You are about to drop the column `phanbaihocPhanBaiHocID` on the `cauhoi` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `cauhoi` DROP FOREIGN KEY `cauhoi_phanbaihocPhanBaiHocID_fkey`;

-- DropIndex
DROP INDEX `cauhoi_phanbaihocPhanBaiHocID_fkey` ON `cauhoi`;

-- AlterTable
ALTER TABLE `cauhoi` DROP COLUMN `phanbaihocPhanBaiHocID`;
