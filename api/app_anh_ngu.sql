-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 04, 2026 at 10:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `app_anh_ngu`
--

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `lichhoc`;
DROP TABLE IF EXISTS `tiendohoctap`;
DROP TABLE IF EXISTS `ketqualambai`;
DROP TABLE IF EXISTS `dangkylop`;
DROP TABLE IF EXISTS `chuyencan`;
DROP TABLE IF EXISTS `danhgiahocvien`;
DROP TABLE IF EXISTS `dapan`;
DROP TABLE IF EXISTS `cauhoi`;
DROP TABLE IF EXISTS `baihoc`;
DROP TABLE IF EXISTS `baikiemtra`;
DROP TABLE IF EXISTS `lophoc`;
DROP TABLE IF EXISTS `khoahoc`;
DROP TABLE IF EXISTS `giaovien`;
DROP TABLE IF EXISTS `hocvien`;
DROP TABLE IF EXISTS `quantrivien`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------

--
-- Table structure for table `baihoc`
--

CREATE TABLE `baihoc` (
  `MaBaiHoc` int(11) NOT NULL,
  PRIMARY KEY (`MaBaiHoc`),
  `TieuDe` varchar(255) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `ThuTu` int(11) DEFAULT 1,
  `MaKhoaHoc` int(11) NOT NULL,
  `TrangThai` varchar(50) DEFAULT 'active',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `baihoc`
--

INSERT INTO `baihoc` (`MaBaiHoc`, `TieuDe`, `NoiDung`, `ThuTu`, `MaKhoaHoc`, `TrangThai`, `NgayTao`) VALUES
(1, 'Giới thiệu tiếng Anh cơ bản', 'Giới thiệu tiếng Anh cơ bản', 1, 1, 'active', '2026-07-01 07:06:26'),
(2, 'Giới thiệu tiếng Anh cơ bản', 'Giới thiệu tiếng Anh cơ bản', 2, 1, 'active', '2026-07-01 07:06:26'),
(3, 'Giới thiệu tiếng Anh cơ bản', 'Giới thiệu tiếng Anh cơ bản', 1, 2, 'active', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `baikiemtra`
--

CREATE TABLE `baikiemtra` (
  `MaBaiKiemTra` int(11) NOT NULL,
  PRIMARY KEY (`MaBaiKiemTra`),
  `MaLop` int(11) DEFAULT NULL,
  `TenBaiKiemTra` varchar(255) NOT NULL,
  `ThoiGianLam` int(11) DEFAULT 60,
  `DiemDat` decimal(5,2) DEFAULT 0.00,
  `TrangThai` varchar(50) DEFAULT 'active',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `baikiemtra`
--

INSERT INTO `baikiemtra` (`MaBaiKiemTra`, `MaLop`, `TenBaiKiemTra`, `ThoiGianLam`, `DiemDat`, `TrangThai`, `NgayTao`) VALUES
(1, 1, 'Kiểm tra nhỏ 1', 30, 7.50, 'active', '2026-07-01 07:06:26'),
(2, 2, 'Kiểm tra nhỏ 1', 45, 8.00, 'active', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `cauhoi`
--

CREATE TABLE `cauhoi` (
  `MaCauHoi` int(11) NOT NULL,
  PRIMARY KEY (`MaCauHoi`),
  `MaBaiHoc` int(11) DEFAULT NULL,
  `NoiDung` text NOT NULL,
  `LoaiCauHoi` varchar(100) DEFAULT NULL,
  `ThuTu` int(11) DEFAULT 0,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cauhoi`
--

INSERT INTO `cauhoi` (`MaCauHoi`, `MaBaiHoc`, `NoiDung`, `LoaiCauHoi`, `ThuTu`, `NgayTao`) VALUES
(1, 1, 'Bài học này thuộc chủ đề nào?', 'multiple_choice', 1, '2026-07-01 07:06:26'),
(2, 1, 'Bài học này thuộc chủ đề nào?', 'multiple_choice', 2, '2026-07-01 07:06:26'),
(3, 3, 'Bài học này thuộc chủ đề nào?', 'multiple_choice', 1, '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `chuyencan`
--

CREATE TABLE `chuyencan` (
  `MaChuyenCan` int(11) NOT NULL,
  `MaHocVien` int(11) NOT NULL,
  `MaLop` int(11) NOT NULL,
  `NgayDiem` date DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT 'Có',
  `GhiChu` text DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chuyencan`
--

INSERT INTO `chuyencan` (`MaChuyenCan`, `MaHocVien`, `MaLop`, `NgayDiem`, `TrangThai`, `GhiChu`, `NgayTao`) VALUES
(1, 1, 1, '2026-01-15', 'Có', 'Đi học đầy đủ', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `dangkylop`
--

CREATE TABLE `dangkylop` (
  `MaDangKy` int(11) NOT NULL,
  `MaHocVien` int(11) NOT NULL,
  `MaLop` int(11) NOT NULL,
  `NgayDangKy` date DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT 'pending',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dangkylop`
--

INSERT INTO `dangkylop` (`MaDangKy`, `MaHocVien`, `MaLop`, `NgayDangKy`, `TrangThai`, `NgayTao`) VALUES
(1, 1, 1, '2026-01-12', 'approved', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `danhgiahocvien`
--

CREATE TABLE `danhgiahocvien` (
  `MaDanhGia` int(11) NOT NULL,
  `MaHocVien` int(11) NOT NULL,
  `MaGiaoVien` int(11) DEFAULT NULL,
  `DiemDanhGia` decimal(5,2) DEFAULT 0.00,
  `NhanXet` text DEFAULT NULL,
  `NgayDanhGia` date DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `danhgiahocvien`
--

INSERT INTO `danhgiahocvien` (`MaDanhGia`, `MaHocVien`, `MaGiaoVien`, `DiemDanhGia`, `NhanXet`, `NgayDanhGia`, `NgayTao`) VALUES
(1, 1, 1, 4.80, 'Học viên có tiến bộ tốt trong giao tiếp cơ bản.', '2026-01-22', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `dapan`
--

CREATE TABLE `dapan` (
  `MaDapAn` int(11) NOT NULL,
  PRIMARY KEY (`MaDapAn`),
  `MaCauHoi` int(11) NOT NULL,
  `NoiDung` text DEFAULT NULL,
  `LaDapAnDung` tinyint(1) DEFAULT 0,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `dapan`
--

INSERT INTO `dapan` (`MaDapAn`, `MaCauHoi`, `NoiDung`, `LaDapAnDung`, `NgayTao`) VALUES
(1, 1, 'Tiếng Anh cơ bản', 1, '2026-07-01 07:06:26'),
(2, 1, 'Tiếng Anh nâng cao', 0, '2026-07-01 07:06:26'),
(3, 1, 'Tiếng Anh giao tiếp', 0, '2026-07-01 07:06:26'),
(4, 2, 'Tiếng Anh giao tiếp', 1, '2026-07-01 07:06:26'),
(5, 2, 'Tiếng Anh giao tiếp', 0, '2026-07-01 07:06:26'),
(6, 3, 'Tiếng Anh giao tiếp', 1, '2026-07-01 07:06:26'),
(7, 3, 'Tiếng Anh giao tiếp', 0, '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `giaovien`
--

CREATE TABLE `giaovien` (
  `MaGiaoVien` int(11) NOT NULL,
  PRIMARY KEY (`MaGiaoVien`),
  `TenDangNhap` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` tinyint(1) DEFAULT 0,
  `TrangThai` tinyint(1) DEFAULT 1,
  `SoDienThoai` varchar(50) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `giaovien`
--

INSERT INTO `giaovien` (`MaGiaoVien`, `TenDangNhap`, `MatKhau`, `HoTen`, `Email`, `NgaySinh`, `GioiTinh`, `TrangThai`, `SoDienThoai`, `DiaChi`, `NgayTao`) VALUES
(1, 'thuy', '123456', 'Nguyễn Thị Thủy', 'thuy@englishcenter.vn', '1990-05-12', 1, 1, '0908123456', 'Quận 7, TP.HCM', '2026-07-01 07:06:26'),
(2, 'minh', '123456', 'Trần Minh', 'minh@englishcenter.vn', '1988-09-22', 0, 1, '0908123457', 'Quận 1, TP.HCM', '2026-07-01 07:06:26'),
(3, 'lan', '123456', 'Phạm Thị Lan', 'lan@englishcenter.vn', '1992-03-18', 1, 1, '0908123458', 'Bình Thạnh, TP.HCM', '2026-07-01 07:06:26'),
(4, 'nguyen', '123456', 'Thầy Nguyên', 'thuy@englishcenter.vn', '1990-05-12', 1, 1, '0908123456', 'Quận 7, TP.HCM', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `hocvien`
--

CREATE TABLE `hocvien` (
  `MaHocVien` int(11) NOT NULL,
  PRIMARY KEY (`MaHocVien`),
  `TenDangNhap` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `NgaySinh` date DEFAULT NULL,
  `GioiTinh` tinyint(1) DEFAULT 0,
  `TrangThai` tinyint(1) DEFAULT 1,
  `SoDienThoai` varchar(50) DEFAULT NULL,
  `DiaChi` varchar(255) DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hocvien`
--

INSERT INTO `hocvien` (`MaHocVien`, `TenDangNhap`, `MatKhau`, `HoTen`, `Email`, `NgaySinh`, `GioiTinh`, `TrangThai`, `SoDienThoai`, `DiaChi`, `NgayTao`) VALUES
(1, 'kha', '123456', 'Minh Kha', 'Kha@gmail.com', '2001-08-10', 0, 1, '0911000001', 'Tân Bình, TP.HCM', '2026-07-01 07:06:26'),
(6, 'trieuPhu', '123456', 'Triệu Phú', 'phu@gmail.com', '2002-09-25', 0, 1, '0911000006', 'Quận 10, TP.HCM', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `ketqualambai`
--

CREATE TABLE `ketqualambai` (
  `MaKetQua` int(11) NOT NULL,
  PRIMARY KEY (`MaKetQua`),
  `MaHocVien` int(11) NOT NULL,
  `MaBaiHoc` int(11) NOT NULL,
  `Diem` decimal(5,2) DEFAULT 0.00,
  `SoCauDung` int(11) DEFAULT 0,
  `TongSoCau` int(11) DEFAULT 0,
  `NgayLam` date DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `khoahoc`
--

CREATE TABLE `khoahoc` (
  `MaKhoaHoc` int(11) NOT NULL,
  PRIMARY KEY (`MaKhoaHoc`),
  `TenKhoaHoc` varchar(255) NOT NULL,
  `TrinhDo` varchar(100) DEFAULT NULL,
  `MoTa` text DEFAULT NULL,
  `NgayBatDau` date DEFAULT NULL,
  `NgayKetThuc` date DEFAULT NULL,
  `TrangThai` varchar(50) DEFAULT 'active',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `khoahoc` - UPDATED: 4 khóa học
--

INSERT INTO `khoahoc` (`MaKhoaHoc`, `TenKhoaHoc`, `TrinhDo`, `MoTa`, `NgayBatDau`, `NgayKetThuc`, `TrangThai`, `NgayTao`) VALUES
(1, 'Tiếng Anh 1', 'A1', 'Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu.', '2026-01-10', '2026-03-20', 'active', '2026-07-01 07:06:26'),
(2, 'Tiếng Anh 2', 'A1', 'Khóa học tiếng Anh giao tiếp chuyên nghiệp trong môi trường công việc.', '2026-02-01', '2026-05-31', 'active', '2026-07-01 07:06:26'),
(3, 'Tiếng Anh 3', 'A2', 'Khóa học tiếng Anh nâng cao cấp độ A2-B1.', '2026-04-01', '2026-06-30', 'active', '2026-07-01 07:06:26'),
(4, 'Nâng lực ngoại ngữ', 'B2+', 'Khóa học nâng cao kỹ năng tiếng Anh toàn diện cho lao động.', '2026-05-01', '2026-07-31', 'active', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `lophoc`
--

CREATE TABLE `lophoc` (
  `MaLop` int(11) NOT NULL,
  PRIMARY KEY (`MaLop`),
  `TenLop` varchar(255) NOT NULL,
  `MaKhoaHoc` int(11) NOT NULL,
  `MaGiaoVien` int(11) DEFAULT NULL,
  `SoLuongToiDa` int(11) DEFAULT 0,
  `TrangThai` varchar(50) DEFAULT 'active',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lophoc` - UPDATED: 4 lớp, 40 chỗ mỗi lớp
--

INSERT INTO `lophoc` (`MaLop`, `TenLop`, `MaKhoaHoc`, `MaGiaoVien`, `SoLuongToiDa`, `TrangThai`, `NgayTao`) VALUES
(1, 'Tiếng Anh 1 - Sáng', 1, 1, 40, 'active', '2026-07-01 07:06:26'),
(2, 'Tiếng Anh 2 - Chiều', 2, 2, 40, 'active', '2026-07-01 07:06:26'),
(3, 'Tiếng Anh 3 - Sáng', 3, 3, 40, 'active', '2026-07-01 07:06:26'),
(4, 'Nâng lực ngoại ngữ - Tối', 4, 4, 40, 'active', '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `lichhoc` - NEW TABLE
--

CREATE TABLE `lichhoc` (
  `MaLichHoc` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `MaLop` int(11) NOT NULL,
  `ThuHoc` int(11) NOT NULL COMMENT '2=Thứ 2, 3=Thứ 3, 4=Thứ 4, 5=Thứ 5, 6=Thứ 6, 7=Thứ 7, 8=Chủ nhật',
  `Buoi` varchar(50) NOT NULL COMMENT 'morning, afternoon, evening',
  `GioBatDau` time NOT NULL,
  `GioKetThuc` time NOT NULL,
  `TrangThai` varchar(50) DEFAULT 'active',
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`MaLop`) REFERENCES `lophoc` (`MaLop`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lichhoc`
--

INSERT INTO `lichhoc` (`MaLop`, `ThuHoc`, `Buoi`, `GioBatDau`, `GioKetThuc`) VALUES
-- Lớp 1 (Tiếng Anh 1 - Sáng): Thứ 2, 4, 6 - 08:00-10:00
(1, 2, 'morning', '08:00:00', '10:00:00'),
(1, 4, 'morning', '08:00:00', '10:00:00'),
(1, 6, 'morning', '08:00:00', '10:00:00'),
-- Lớp 2 (Tiếng Anh 2 - Chiều): Thứ 3, 5, 7 - 14:00-16:00
(2, 3, 'afternoon', '14:00:00', '16:00:00'),
(2, 5, 'afternoon', '14:00:00', '16:00:00'),
(2, 7, 'afternoon', '14:00:00', '16:00:00'),
-- Lớp 3 (Tiếng Anh 3 - Sáng): Thứ 2, 4, 6 - 08:00-10:00
(3, 2, 'morning', '08:00:00', '10:00:00'),
(3, 4, 'morning', '08:00:00', '10:00:00'),
(3, 6, 'morning', '08:00:00', '10:00:00'),
-- Lớp 4 (Nâng lực ngoại ngữ - Tối): Thứ 2, 4, 6 - 18:00-20:00
(4, 2, 'evening', '18:00:00', '20:00:00'),
(4, 4, 'evening', '18:00:00', '20:00:00'),
(4, 6, 'evening', '18:00:00', '20:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `quantrivien`
--

CREATE TABLE `quantrivien` (
  `MaQuanTriVien` int(11) NOT NULL,
  PRIMARY KEY (`MaQuanTriVien`),
  `TenDangNhap` varchar(100) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `PhanQuyen` varchar(50) DEFAULT 'admin',
  `TrangThai` tinyint(1) DEFAULT 1,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quantrivien`
--

INSERT INTO `quantrivien` (`MaQuanTriVien`, `TenDangNhap`, `MatKhau`, `HoTen`, `Email`, `PhanQuyen`, `TrangThai`, `NgayTao`) VALUES
(1, 'admin', '123456', 'Quản trị viên hệ thống', 'admin@englishcenter.vn', 'admin', 1, '2026-07-01 07:06:26');

-- --------------------------------------------------------

--
-- Table structure for table `tiendohoctap`
--

CREATE TABLE `tiendohoctap` (
  `MaTienDo` int(11) NOT NULL,
  PRIMARY KEY (`MaTienDo`),
  `MaHocVien` int(11) NOT NULL,
  `MaBaiHoc` int(11) NOT NULL,
  `PhanTramHoanThanh` decimal(5,2) DEFAULT 0.00,
  `NgayCapNhat` date DEFAULT NULL,
  `NgayTao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tiendohoctap`
--

INSERT INTO `tiendohoctap` (`MaTienDo`, `MaHocVien`, `MaBaiHoc`, `PhanTramHoanThanh`, `NgayCapNhat`, `NgayTao`) VALUES
(1, 1, 1, 100.00, '2026-01-16', '2026-07-01 07:06:26'),
(2, 1, 2, 60.00, '2026-01-20', '2026-07-01 07:06:26');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `baihoc`
--
ALTER TABLE `baihoc`
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`);

--
-- Indexes for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  ADD KEY `MaLop` (`MaLop`);

--
-- Indexes for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD KEY `MaBaiHoc` (`MaBaiHoc`);

--
-- Indexes for table `chuyencan`
--
ALTER TABLE `chuyencan`
  ADD PRIMARY KEY (`MaChuyenCan`),
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaLop` (`MaLop`);

--
-- Indexes for table `dangkylop`
--
ALTER TABLE `dangkylop`
  ADD PRIMARY KEY (`MaDangKy`),
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaLop` (`MaLop`);

--
-- Indexes for table `danhgiahocvien`
--
ALTER TABLE `danhgiahocvien`
  ADD PRIMARY KEY (`MaDanhGia`),
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaGiaoVien` (`MaGiaoVien`);

--
-- Indexes for table `dapan`
--
ALTER TABLE `dapan`
  ADD KEY `MaCauHoi` (`MaCauHoi`);

--
-- Indexes for table `giaovien`
--
ALTER TABLE `giaovien`
  ADD UNIQUE KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `hocvien`
--
ALTER TABLE `hocvien`
  ADD UNIQUE KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `ketqualambai`
--
ALTER TABLE `ketqualambai`
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaBaiHoc` (`MaBaiHoc`);

--
-- Indexes for table `khoahoc`
--

--
-- Indexes for table `lichhoc`
--
ALTER TABLE `lichhoc`
  ADD KEY `MaLop` (`MaLop`);

--
-- Indexes for table `lophoc`
--
ALTER TABLE `lophoc`
  ADD KEY `MaKhoaHoc` (`MaKhoaHoc`),
  ADD KEY `MaGiaoVien` (`MaGiaoVien`);

--
-- Indexes for table `quantrivien`
--
ALTER TABLE `quantrivien`
  ADD UNIQUE KEY `TenDangNhap` (`TenDangNhap`);

--
-- Indexes for table `tiendohoctap`
--
ALTER TABLE `tiendohoctap`
  ADD KEY `MaHocVien` (`MaHocVien`),
  ADD KEY `MaBaiHoc` (`MaBaiHoc`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `baihoc`
--
ALTER TABLE `baihoc`
  MODIFY `MaBaiHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  MODIFY `MaBaiKiemTra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cauhoi`
--
ALTER TABLE `cauhoi`
  MODIFY `MaCauHoi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chuyencan`
--
ALTER TABLE `chuyencan`
  MODIFY `MaChuyenCan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dangkylop`
--
ALTER TABLE `dangkylop`
  MODIFY `MaDangKy` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `danhgiahocvien`
--
ALTER TABLE `danhgiahocvien`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `dapan`
--
ALTER TABLE `dapan`
  MODIFY `MaDapAn` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `giaovien`
--
ALTER TABLE `giaovien`
  MODIFY `MaGiaoVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `hocvien`
--
ALTER TABLE `hocvien`
  MODIFY `MaHocVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `ketqualambai`
--
ALTER TABLE `ketqualambai`
  MODIFY `MaKetQua` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `khoahoc`
--
ALTER TABLE `khoahoc`
  MODIFY `MaKhoaHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `lichhoc`
--
ALTER TABLE `lichhoc`
  MODIFY `MaLichHoc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `lophoc`
--
ALTER TABLE `lophoc`
  MODIFY `MaLop` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quantrivien`
--
ALTER TABLE `quantrivien`
  MODIFY `MaQuanTriVien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `tiendohoctap`
--
ALTER TABLE `tiendohoctap`
  MODIFY `MaTienDo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `baihoc`
--
ALTER TABLE `baihoc`
  ADD CONSTRAINT `baihoc_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`) ON DELETE CASCADE;

--
-- Constraints for table `baikiemtra`
--
ALTER TABLE `baikiemtra`
  ADD CONSTRAINT `baikiemtra_ibfk_1` FOREIGN KEY (`MaLop`) REFERENCES `lophoc` (`MaLop`) ON DELETE SET NULL;

--
-- Constraints for table `cauhoi`
--
ALTER TABLE `cauhoi`
  ADD CONSTRAINT `cauhoi_ibfk_1` FOREIGN KEY (`MaBaiHoc`) REFERENCES `baihoc` (`MaBaiHoc`) ON DELETE SET NULL;

--
-- Constraints for table `chuyencan`
--
ALTER TABLE `chuyencan`
  ADD CONSTRAINT `chuyencan_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`) ON DELETE CASCADE,
  ADD CONSTRAINT `chuyencan_ibfk_2` FOREIGN KEY (`MaLop`) REFERENCES `lophoc` (`MaLop`) ON DELETE CASCADE;

--
-- Constraints for table `dangkylop`
--
ALTER TABLE `dangkylop`
  ADD CONSTRAINT `dangkylop_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`) ON DELETE CASCADE,
  ADD CONSTRAINT `dangkylop_ibfk_2` FOREIGN KEY (`MaLop`) REFERENCES `lophoc` (`MaLop`) ON DELETE CASCADE;

--
-- Constraints for table `danhgiahocvien`
--
ALTER TABLE `danhgiahocvien`
  ADD CONSTRAINT `danhgiahocvien_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`) ON DELETE CASCADE,
  ADD CONSTRAINT `danhgiahocvien_ibfk_2` FOREIGN KEY (`MaGiaoVien`) REFERENCES `giaovien` (`MaGiaoVien`) ON DELETE SET NULL;

--
-- Constraints for table `dapan`
--
ALTER TABLE `dapan`
  ADD CONSTRAINT `dapan_ibfk_1` FOREIGN KEY (`MaCauHoi`) REFERENCES `cauhoi` (`MaCauHoi`) ON DELETE CASCADE;

--
-- Constraints for table `ketqualambai`
--
ALTER TABLE `ketqualambai`
  ADD CONSTRAINT `ketqualambai_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`) ON DELETE CASCADE,
  ADD CONSTRAINT `ketqualambai_ibfk_2` FOREIGN KEY (`MaBaiHoc`) REFERENCES `baihoc` (`MaBaiHoc`) ON DELETE CASCADE;

--
-- Constraints for table `lophoc`
--
ALTER TABLE `lophoc`
  ADD CONSTRAINT `lophoc_ibfk_1` FOREIGN KEY (`MaKhoaHoc`) REFERENCES `khoahoc` (`MaKhoaHoc`) ON DELETE CASCADE,
  ADD CONSTRAINT `lophoc_ibfk_2` FOREIGN KEY (`MaGiaoVien`) REFERENCES `giaovien` (`MaGiaoVien`) ON DELETE SET NULL;

--
-- Constraints for table `tiendohoctap`
--
ALTER TABLE `tiendohoctap`
  ADD CONSTRAINT `tiendohoctap_ibfk_1` FOREIGN KEY (`MaHocVien`) REFERENCES `hocvien` (`MaHocVien`) ON DELETE CASCADE,
  ADD CONSTRAINT `tiendohoctap_ibfk_2` FOREIGN KEY (`MaBaiHoc`) REFERENCES `baihoc` (`MaBaiHoc`) ON DELETE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
