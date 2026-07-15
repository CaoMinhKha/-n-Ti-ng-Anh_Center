-- CreateTable
CREATE TABLE `baihoc` (
    `BaiHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `KhoaHocID` INTEGER NOT NULL,
    `TenBaiHoc` VARCHAR(200) NOT NULL,
    `MoTa` TEXT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,
    `TrangThai` ENUM('AN', 'HIEN') NULL DEFAULT 'HIEN',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_BaiHoc_KhoaHoc`(`KhoaHocID`),
    PRIMARY KEY (`BaiHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `baikiemtra` (
    `BaiKiemTraID` INTEGER NOT NULL AUTO_INCREMENT,
    `PhanBaiHocID` INTEGER NOT NULL,
    `TenBaiKiemTra` VARCHAR(200) NOT NULL,
    `ThoiGianBatDau` DATETIME(0) NULL,
    `ThoiGianLamBai` INTEGER NOT NULL,
    `DiemDat` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `DiemMax` DECIMAL(5, 2) NULL DEFAULT 100.00,
    `TrangThai` ENUM('AN', 'HIEN') NULL DEFAULT 'HIEN',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_BaiKiemTra_PhanBaiHoc`(`PhanBaiHocID`),
    PRIMARY KEY (`BaiKiemTraID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `baikiemtra_cauhoi` (
    `BaiKiemTraID` INTEGER NOT NULL,
    `CauHoiID` INTEGER NOT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,

    INDEX `IDX_BKTCH_CauHoi`(`CauHoiID`),
    PRIMARY KEY (`BaiKiemTraID`, `CauHoiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bailam` (
    `BaiLamID` INTEGER NOT NULL AUTO_INCREMENT,
    `BaiKiemTraID` INTEGER NOT NULL,
    `HocVienID` INTEGER NOT NULL,
    `LopHocID` INTEGER NOT NULL,
    `ThoiGianBatDau` DATETIME(0) NOT NULL,
    `ThoiGianNop` DATETIME(0) NULL,
    `TongDiem` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `TrangThai` ENUM('DANG_LAM', 'DA_NOP', 'HET_GIO') NULL DEFAULT 'HET_GIO',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_BaiLam_BaiKiemTra`(`BaiKiemTraID`),
    INDEX `IDX_BaiLam_HocVien`(`HocVienID`),
    INDEX `IDX_BaiLam_LopHoc`(`LopHocID`),
    PRIMARY KEY (`BaiLamID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bailam_chitiet` (
    `BaiLamID` INTEGER NOT NULL,
    `CauHoiID` INTEGER NOT NULL,
    `DapAnID` INTEGER NULL,
    `NoiDungTraLoi` TEXT NULL,
    `LaDung` BOOLEAN NULL DEFAULT false,

    INDEX `FK_BLCT_DapAn`(`DapAnID`),
    INDEX `IDX_BLCT_CauHoi`(`CauHoiID`),
    PRIMARY KEY (`BaiLamID`, `CauHoiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buoihoc` (
    `BuoiHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `LopHocID` INTEGER NOT NULL,
    `LichHocID` INTEGER NOT NULL,
    `CaHocID` INTEGER NOT NULL,
    `PhongHocID` INTEGER NULL,
    `NgayHoc` DATE NOT NULL,
    `TrangThai` ENUM('CHUA_HOC', 'DANG_HOC', 'DA_HOC') NULL DEFAULT 'CHUA_HOC',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_BuoiHoc_CaHoc`(`CaHocID`),
    INDEX `FK_BuoiHoc_LichHoc`(`LichHocID`),
    INDEX `FK_BuoiHoc_PhongHoc`(`PhongHocID`),
    INDEX `IDX_BuoiHoc_LopHoc`(`LopHocID`),
    INDEX `IDX_BuoiHoc_NgayHoc`(`NgayHoc`),
    PRIMARY KEY (`BuoiHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cahoc` (
    `CaHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `MaCa` VARCHAR(20) NOT NULL,
    `TenCa` VARCHAR(100) NOT NULL,
    `GioBatDau` TIME(0) NOT NULL,
    `GioKetThuc` TIME(0) NOT NULL,
    `TrangThai` ENUM('HOAT_DONG', 'NGUNG_HOAT_DONG') NULL DEFAULT 'HOAT_DONG',

    UNIQUE INDEX `UQ_CaHoc_MaCa`(`MaCa`),
    PRIMARY KEY (`CaHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cauhoi` (
    `CauHoiID` INTEGER NOT NULL AUTO_INCREMENT,
    `PhanBaiHocID` INTEGER NOT NULL,
    `LoaiCauHoi` ENUM('TRAC_NGHIEM_MOT_DAP_AN', 'DUNG_SAI', 'TRAC_NGHIEM_NHIEU_DAP_AN', 'DIEN_VAO_CHO_TRONG', 'NOI_CAP', 'SAP_XEP', 'PHAN_LOAI') NOT NULL,
    `NoiDungText` TEXT NULL,
    `NoiDungUrl` VARCHAR(500) NULL,
    `CauHinhJson` JSON NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,
    `TrangThai` ENUM('AN', 'HIEN') NULL DEFAULT 'HIEN',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_CauHoi_PhanBaiHoc`(`PhanBaiHocID`),
    PRIMARY KEY (`CauHoiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `danhmuc` (
    `DanhMucID` INTEGER NOT NULL AUTO_INCREMENT,
    `TenDanhMuc` VARCHAR(100) NOT NULL,
    `MoTa` TEXT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 0,
    `DanhMucChaID` INTEGER NULL,
    `TrangThai` ENUM('HOAT_DONG', 'NGUNG_HOAT_DONG') NULL DEFAULT 'HOAT_DONG',

    UNIQUE INDEX `danhmuc_TenDanhMuc_key`(`TenDanhMuc`),
    INDEX `IDX_DanhMuc_Cha`(`DanhMucChaID`),
    INDEX `IDX_DanhMuc_TenDanhMuc`(`TenDanhMuc`),
    PRIMARY KEY (`DanhMucID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dapan` (
    `DapAnID` INTEGER NOT NULL AUTO_INCREMENT,
    `CauHoiID` INTEGER NOT NULL,
    `NoiDungText` TEXT NULL,
    `NoiDungUrl` VARCHAR(500) NULL,
    `LaDapAnDung` BOOLEAN NULL DEFAULT false,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,

    INDEX `IDX_DapAn_CauHoi`(`CauHoiID`),
    PRIMARY KEY (`DapAnID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dotkhaigiang` (
    `DotKhaiGiangID` INTEGER NOT NULL AUTO_INCREMENT,
    `MaDot` VARCHAR(30) NOT NULL,
    `TenDot` VARCHAR(200) NOT NULL,
    `NgayMoDangKy` DATE NOT NULL,
    `NgayDongDangKy` DATE NOT NULL,
    `MoTa` TEXT NULL,
    `TrangThai` ENUM('SAP_MO', 'DANG_MO', 'DA_DONG') NULL DEFAULT 'SAP_MO',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UQ_DotKhaiGiang_MaDot`(`MaDot`),
    INDEX `IDX_DotKhaiGiang_MaDot`(`MaDot`),
    PRIMARY KEY (`DotKhaiGiangID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `giaovien` (
    `GiaoVienID` INTEGER NOT NULL AUTO_INCREMENT,
    `TaiKhoanID` INTEGER NOT NULL,
    `MaGiaoVien` VARCHAR(30) NOT NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UQ_GiaoVien_TaiKhoan`(`TaiKhoanID`),
    UNIQUE INDEX `UQ_GiaoVien_MaGiaoVien`(`MaGiaoVien`),
    INDEX `IDX_GiaoVien_MaGiaoVien`(`MaGiaoVien`),
    PRIMARY KEY (`GiaoVienID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocvien` (
    `HocVienID` INTEGER NOT NULL AUTO_INCREMENT,
    `TaiKhoanID` INTEGER NOT NULL,
    `MaHocVien` VARCHAR(30) NOT NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UQ_HocVien_TaiKhoan`(`TaiKhoanID`),
    UNIQUE INDEX `UQ_HocVien_MaHocVien`(`MaHocVien`),
    INDEX `IDX_HocVien_MaHocVien`(`MaHocVien`),
    PRIMARY KEY (`HocVienID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocvien_diemdanh` (
    `HocVienID` INTEGER NOT NULL,
    `BuoiHocID` INTEGER NOT NULL,
    `TrangThaiDiemDanh` ENUM('CO_MAT', 'VANG_CO_PHEP', 'VANG_KHONG_PHEP', 'DI_MUON') NULL DEFAULT 'VANG_KHONG_PHEP',
    `ThoiGianCheckIn` DATETIME(0) NULL,
    `GhiChu` VARCHAR(255) NULL,

    INDEX `IDX_HVDD_BuoiHoc`(`BuoiHocID`),
    PRIMARY KEY (`HocVienID`, `BuoiHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hocvien_lophoc` (
    `HocVien_LopHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `HocVienID` INTEGER NOT NULL,
    `LopHocID` INTEGER NOT NULL,
    `HocPhi` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `NgayDangKy` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `DongHocPhi` BOOLEAN NULL DEFAULT false,
    `TrangThai` ENUM('CHO_DUYET', 'DA_DUYET', 'TU_CHOI') NULL DEFAULT 'CHO_DUYET',

    INDEX `IDX_HVLH_LopHoc`(`LopHocID`),
    UNIQUE INDEX `UQ_HocVien_LopHoc`(`HocVienID`, `LopHocID`),
    PRIMARY KEY (`HocVien_LopHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ketquahoctap` (
    `KetQuaHocTapID` INTEGER NOT NULL AUTO_INCREMENT,
    `HocVienID` INTEGER NOT NULL,
    `LopHocID` INTEGER NOT NULL,
    `DiemChuyenCan` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `DiemBaiTap` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `DiemKiemTra` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `TongDiem` DECIMAL(5, 2) NULL DEFAULT 0.00,
    `XepLoai` ENUM('XUAT_SAC', 'GIOI', 'KHA', 'TRUNG_BINH', 'KHONG_DAT') NULL DEFAULT 'KHONG_DAT',
    `NgayCapNhat` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_KQHT_HocVien`(`HocVienID`),
    INDEX `IDX_KQHT_LopHoc`(`LopHocID`),
    UNIQUE INDEX `UQ_KQHT`(`HocVienID`, `LopHocID`),
    PRIMARY KEY (`KetQuaHocTapID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `khoahoc` (
    `KhoaHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `TenKhoaHoc` VARCHAR(200) NOT NULL,
    `TrinhDoID` INTEGER NOT NULL,
    `HocPhi` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `MoTa` TEXT NULL,
    `TrangThai` ENUM('SAP_MO', 'DANG_MO', 'TAM_DUNG') NULL DEFAULT 'DANG_MO',
    `IsDeleted` BOOLEAN NULL DEFAULT false,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_KhoaHoc_Ten`(`TenKhoaHoc`),
    INDEX `IDX_KhoaHoc_TrinhDo`(`TrinhDoID`),
    PRIMARY KEY (`KhoaHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lichhoc` (
    `LichHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `LopHocID` INTEGER NOT NULL,
    `ThuTrongTuan` TINYINT NOT NULL,
    `CaHocID` INTEGER NOT NULL,
    `PhongHocID` INTEGER NULL,
    `NgayApDung` DATE NOT NULL,
    `NgayKetThuc` DATE NOT NULL,
    `TrangThai` ENUM('HOAT_DONG', 'TAM_DUNG') NULL DEFAULT 'HOAT_DONG',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_LichHoc_CaHoc`(`CaHocID`),
    INDEX `FK_LichHoc_PhongHoc`(`PhongHocID`),
    INDEX `IDX_LichHoc_LopHoc`(`LopHocID`),
    PRIMARY KEY (`LichHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lophoc` (
    `LopHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `DotKhaiGiangID` INTEGER NOT NULL,
    `KhoaHocID` INTEGER NOT NULL,
    `GiaoVienID` INTEGER NOT NULL,
    `TenLopHoc` VARCHAR(200) NOT NULL,
    `HinhThucHoc` ENUM('ONLLINE', 'OFFLINE') NOT NULL,
    `HocPhi` DECIMAL(12, 2) NULL DEFAULT 0.00,
    `SiSoToiDa` INTEGER NULL DEFAULT 30,
    `NgayBatDau` DATE NOT NULL,
    `NgayKetThuc` DATE NOT NULL,
    `TrangThai` ENUM('SAP_KHAI_GIANG', 'DANG_HOC', 'DA_KET_THUC', 'DA_HUY') NULL DEFAULT 'SAP_KHAI_GIANG',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_LopHoc_DotKhaiGiang`(`DotKhaiGiangID`),
    INDEX `IDX_LopHoc_GiaoVien`(`GiaoVienID`),
    INDEX `IDX_LopHoc_KhoaHoc`(`KhoaHocID`),
    PRIMARY KEY (`LopHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `madiemdanh` (
    `MaDiemDanhID` INTEGER NOT NULL AUTO_INCREMENT,
    `BuoiHocID` INTEGER NOT NULL,
    `GiaoVienID` INTEGER NOT NULL,
    `NoiDungMaDiemDanh` VARCHAR(100) NOT NULL,
    `ThoiGianHetHan` DATETIME(0) NOT NULL,
    `TrangThai` ENUM('DANG_HOAT_DONG', 'HET_HAN', 'DA_DONG') NULL DEFAULT 'DANG_HOAT_DONG',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_MaDiemDanh_GiaoVien`(`GiaoVienID`),
    INDEX `IDX_MaDiemDanh_BuoiHoc`(`BuoiHocID`),
    PRIMARY KEY (`MaDiemDanhID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otp_xacthuc` (
    `OtpID` INTEGER NOT NULL AUTO_INCREMENT,
    `TaiKhoanID` INTEGER NOT NULL,
    `LoaiOTP` ENUM('DANG_KY', 'QUEN_MAT_KHAU') NOT NULL,
    `MaOTP` VARCHAR(10) NOT NULL,
    `DaSuDung` BOOLEAN NULL DEFAULT false,
    `NgayHetHan` DATETIME(0) NOT NULL,
    `VoHieuHoa` BOOLEAN NULL DEFAULT false,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_OTP_TaiKhoan`(`TaiKhoanID`),
    PRIMARY KEY (`OtpID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phanbaihoc` (
    `PhanBaiHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `BaiHocID` INTEGER NOT NULL,
    `TenPhanBaiHoc` VARCHAR(200) NOT NULL,
    `TieuDe` VARCHAR(255) NULL,
    `VideoUrl` VARCHAR(500) NULL,
    `LoaiPhanBaiHoc` ENUM('BAI_HOC', 'BAI_KIEM_TRA') NOT NULL,
    `ThuTuHienThi` INTEGER NULL DEFAULT 1,
    `TrangThai` ENUM('AN', 'HIEN') NULL DEFAULT 'HIEN',
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_PhanBaiHoc_BaiHoc`(`BaiHocID`),
    PRIMARY KEY (`PhanBaiHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `phonghoc` (
    `PhongHocID` INTEGER NOT NULL AUTO_INCREMENT,
    `MaPhong` VARCHAR(20) NOT NULL,
    `TenPhong` VARCHAR(100) NOT NULL,
    `SucChua` INTEGER NOT NULL,
    `ToaNha` VARCHAR(100) NULL,
    `TrangThai` ENUM('TRONG', 'DANG_SU_DUNG', 'BAO_TRI') NULL DEFAULT 'TRONG',

    UNIQUE INDEX `UQ_PhongHoc_MaPhong`(`MaPhong`),
    PRIMARY KEY (`PhongHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `taikhoan` (
    `TaiKhoanID` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(255) NOT NULL,
    `MatKhauHash` VARCHAR(255) NOT NULL,
    `VaiTro` ENUM('ADMIN', 'GIAO_VIEN', 'HOC_VIEN') NOT NULL,
    `HoVaTen` VARCHAR(100) NOT NULL,
    `NgaySinh` DATE NULL,
    `GioiTinh` ENUM('NAM', 'NU', 'KHAC') NULL DEFAULT 'KHAC',
    `AvatarUrl` VARCHAR(500) NULL,
    `EmailVerifiedAt` DATETIME(0) NULL,
    `RefreshToken` VARCHAR(500) NULL,
    `RefreshTokenExpireAt` DATETIME(0) NULL,
    `TrangThai` ENUM('HOAT_DONG', 'KHOA', 'CHO_XAC_THUC') NULL DEFAULT 'CHO_XAC_THUC',
    `IsDeleted` BOOLEAN NULL DEFAULT false,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `UQ_TaiKhoan_Email`(`Email`),
    INDEX `IDX_TaiKhoan_Email`(`Email`),
    INDEX `IDX_TaiKhoan_TrangThai`(`TrangThai`),
    INDEX `IDX_TaiKhoan_VaiTro`(`VaiTro`),
    PRIMARY KEY (`TaiKhoanID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tiendohoctap` (
    `HocVienID` INTEGER NOT NULL,
    `LopHocID` INTEGER NOT NULL,
    `PhanBaiHocID` INTEGER NOT NULL,
    `TongSoCauHoi` INTEGER NULL DEFAULT 0,
    `TongSoCauHoiDung` INTEGER NULL DEFAULT 0,
    `TrangThai` ENUM('CHUA_BAT_DAU', 'DANG_HOC', 'HOAN_THANH') NULL DEFAULT 'CHUA_BAT_DAU',
    `NgayBatDau` DATETIME(0) NULL,
    `NgayHoanThanh` DATETIME(0) NULL,
    `CreatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `IDX_TDHT_LopHoc`(`LopHocID`),
    INDEX `IDX_TDHT_PhanBaiHoc`(`PhanBaiHocID`),
    INDEX `IDX_TDHT_TrangThai`(`TrangThai`),
    PRIMARY KEY (`HocVienID`, `LopHocID`, `PhanBaiHocID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `baihoc` ADD CONSTRAINT `FK_BaiHoc_KhoaHoc` FOREIGN KEY (`KhoaHocID`) REFERENCES `khoahoc`(`KhoaHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `baikiemtra` ADD CONSTRAINT `FK_BaiKiemTra_PhanBaiHoc` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `baikiemtra_cauhoi` ADD CONSTRAINT `FK_BKTCH_BaiKiemTra` FOREIGN KEY (`BaiKiemTraID`) REFERENCES `baikiemtra`(`BaiKiemTraID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `baikiemtra_cauhoi` ADD CONSTRAINT `FK_BKTCH_CauHoi` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam` ADD CONSTRAINT `FK_BaiLam_BaiKiemTra` FOREIGN KEY (`BaiKiemTraID`) REFERENCES `baikiemtra`(`BaiKiemTraID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam` ADD CONSTRAINT `FK_BaiLam_HocVien` FOREIGN KEY (`HocVienID`) REFERENCES `hocvien`(`HocVienID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam` ADD CONSTRAINT `FK_BaiLam_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam_chitiet` ADD CONSTRAINT `FK_BLCT_BaiLam` FOREIGN KEY (`BaiLamID`) REFERENCES `bailam`(`BaiLamID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam_chitiet` ADD CONSTRAINT `FK_BLCT_CauHoi` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bailam_chitiet` ADD CONSTRAINT `FK_BLCT_DapAn` FOREIGN KEY (`DapAnID`) REFERENCES `dapan`(`DapAnID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buoihoc` ADD CONSTRAINT `FK_BuoiHoc_CaHoc` FOREIGN KEY (`CaHocID`) REFERENCES `cahoc`(`CaHocID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buoihoc` ADD CONSTRAINT `FK_BuoiHoc_LichHoc` FOREIGN KEY (`LichHocID`) REFERENCES `lichhoc`(`LichHocID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buoihoc` ADD CONSTRAINT `FK_BuoiHoc_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buoihoc` ADD CONSTRAINT `FK_BuoiHoc_PhongHoc` FOREIGN KEY (`PhongHocID`) REFERENCES `phonghoc`(`PhongHocID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `cauhoi` ADD CONSTRAINT `FK_CauHoi_PhanBaiHoc` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `danhmuc` ADD CONSTRAINT `FK_DanhMuc_DanhMucCha` FOREIGN KEY (`DanhMucChaID`) REFERENCES `danhmuc`(`DanhMucID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dapan` ADD CONSTRAINT `FK_DapAn_CauHoi` FOREIGN KEY (`CauHoiID`) REFERENCES `cauhoi`(`CauHoiID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `giaovien` ADD CONSTRAINT `FK_GiaoVien_TaiKhoan` FOREIGN KEY (`TaiKhoanID`) REFERENCES `taikhoan`(`TaiKhoanID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien` ADD CONSTRAINT `FK_HocVien_TaiKhoan` FOREIGN KEY (`TaiKhoanID`) REFERENCES `taikhoan`(`TaiKhoanID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien_diemdanh` ADD CONSTRAINT `FK_HVDD_BuoiHoc` FOREIGN KEY (`BuoiHocID`) REFERENCES `buoihoc`(`BuoiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien_diemdanh` ADD CONSTRAINT `FK_HVDD_HocVien` FOREIGN KEY (`HocVienID`) REFERENCES `hocvien`(`HocVienID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien_lophoc` ADD CONSTRAINT `FK_HVLH_HocVien` FOREIGN KEY (`HocVienID`) REFERENCES `hocvien`(`HocVienID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hocvien_lophoc` ADD CONSTRAINT `FK_HVLH_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ketquahoctap` ADD CONSTRAINT `FK_KQHT_HocVien` FOREIGN KEY (`HocVienID`) REFERENCES `hocvien`(`HocVienID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ketquahoctap` ADD CONSTRAINT `FK_KQHT_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `khoahoc` ADD CONSTRAINT `FK_KhoaHoc_TrinhDo` FOREIGN KEY (`TrinhDoID`) REFERENCES `danhmuc`(`DanhMucID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichhoc` ADD CONSTRAINT `FK_LichHoc_CaHoc` FOREIGN KEY (`CaHocID`) REFERENCES `cahoc`(`CaHocID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichhoc` ADD CONSTRAINT `FK_LichHoc_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lichhoc` ADD CONSTRAINT `FK_LichHoc_PhongHoc` FOREIGN KEY (`PhongHocID`) REFERENCES `phonghoc`(`PhongHocID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_DotKhaiGiang` FOREIGN KEY (`DotKhaiGiangID`) REFERENCES `dotkhaigiang`(`DotKhaiGiangID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_GiaoVien` FOREIGN KEY (`GiaoVienID`) REFERENCES `giaovien`(`GiaoVienID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lophoc` ADD CONSTRAINT `FK_LopHoc_KhoaHoc` FOREIGN KEY (`KhoaHocID`) REFERENCES `khoahoc`(`KhoaHocID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `madiemdanh` ADD CONSTRAINT `FK_MaDiemDanh_BuoiHoc` FOREIGN KEY (`BuoiHocID`) REFERENCES `buoihoc`(`BuoiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `madiemdanh` ADD CONSTRAINT `FK_MaDiemDanh_GiaoVien` FOREIGN KEY (`GiaoVienID`) REFERENCES `giaovien`(`GiaoVienID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otp_xacthuc` ADD CONSTRAINT `FK_OTP_TaiKhoan` FOREIGN KEY (`TaiKhoanID`) REFERENCES `taikhoan`(`TaiKhoanID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `phanbaihoc` ADD CONSTRAINT `FK_PhanBaiHoc_BaiHoc` FOREIGN KEY (`BaiHocID`) REFERENCES `baihoc`(`BaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiendohoctap` ADD CONSTRAINT `FK_TDHT_HocVien` FOREIGN KEY (`HocVienID`) REFERENCES `hocvien`(`HocVienID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiendohoctap` ADD CONSTRAINT `FK_TDHT_LopHoc` FOREIGN KEY (`LopHocID`) REFERENCES `lophoc`(`LopHocID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tiendohoctap` ADD CONSTRAINT `FK_TDHT_PhanBaiHoc` FOREIGN KEY (`PhanBaiHocID`) REFERENCES `phanbaihoc`(`PhanBaiHocID`) ON DELETE CASCADE ON UPDATE CASCADE;
