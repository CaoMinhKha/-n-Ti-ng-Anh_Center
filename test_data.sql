USE app_anh_ngu;
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE DanhGiaHocVien;
TRUNCATE TABLE TienDoHocTap;
TRUNCATE TABLE ChuyenCan;
TRUNCATE TABLE DangKyLop;
TRUNCATE TABLE BaiKiemTra;
TRUNCATE TABLE DapAn;
TRUNCATE TABLE CauHoi;
TRUNCATE TABLE BaiHoc;
TRUNCATE TABLE LopHoc;
TRUNCATE TABLE KhoaHoc;
TRUNCATE TABLE GiaoVien;
TRUNCATE TABLE HocVien;
TRUNCATE TABLE QuanTriVien;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO QuanTriVien (TenDangNhap, MatKhau, HoTen, Email, PhanQuyen, TrangThai) VALUES
(N'admin', N'123456', N'Quản trị viên hệ thống', N'admin@englishcenter.vn', N'admin', 1);

INSERT INTO GiaoVien (TenDangNhap, MatKhau, HoTen, Email, NgaySinh, GioiTinh, TrangThai, SoDienThoai, DiaChi) VALUES
(N'thuy', N'123456', N'Nguyễn Thị Thủy', N'thuy@englishcenter.vn', N'1990-05-12', 1, 1, N'0908123456', N'Quận 7, TP.HCM'),
(N'minh', N'123456', N'Trần Minh', N'minh@englishcenter.vn', N'1988-09-22', 0, 1, N'0908123457', N'Quận 1, TP.HCM'),
(N'lan', N'123456', N'Phạm Thị Lan', N'lan@englishcenter.vn', N'1992-03-18', 1, 1, N'0908123458', N'Bình Thạnh, TP.HCM');

INSERT INTO HocVien (TenDangNhap, MatKhau, HoTen, Email, NgaySinh, GioiTinh, TrangThai, SoDienThoai, DiaChi) VALUES
(N'an', N'123456', N'Nguyễn Văn An', N'an@gmail.com', N'2001-08-10', 0, 1, N'0911000001', N'Tân Bình, TP.HCM'),
(N'binh', N'123456', N'Trần Thị Bình', N'binh@gmail.com', N'2002-11-20', 1, 1, N'0911000002', N'Gò Vấp, TP.HCM'),
(N'cuong', N'123456', N'Lê Văn Cường', N'cuong@gmail.com', N'2000-04-15', 0, 1, N'0911000003', N'Bình Tân, TP.HCM'),
(N'dung', N'123456', N'Phạm Quốc Dũng', N'dung@gmail.com', N'2003-01-05', 0, 1, N'0911000004', N'Thủ Đức, TP.HCM'),
(N'hoa', N'123456', N'Đỗ Thị Hoa', N'hoa@gmail.com', N'2001-07-30', 1, 1, N'0911000005', N'Nhà Bè, TP.HCM'),
(N'khanh', N'123456', N'Ngô Minh Khánh', N'khanh@gmail.com', N'2002-09-25', 0, 1, N'0911000006', N'Quận 10, TP.HCM');

INSERT INTO KhoaHoc (TenKhoaHoc, TrinhDo, MoTa, NgayBatDau, NgayKetThuc, TrangThai) VALUES
(N'Tiếng Anh cơ bản', N'A1', N'Khóa học tiếng Anh cơ bản dành cho người mới bắt đầu.', N'2026-01-10', N'2026-03-20', N'active'),
(N'Tiếng Anh thương mại', N'B1', N'Khóa học tiếng Anh giao tiếp chuyên nghiệp trong môi trường công việc.', N'2026-02-01', N'2026-05-31', N'active');

INSERT INTO LopHoc (TenLop, MaKhoaHoc, MaGiaoVien, SoLuongToiDa, TrangThai) VALUES
(N'Lớp A1 cơ bản', 1, 1, 20, N'active'),
(N'Lớp Thương mại 1', 2, 2, 15, N'active');

INSERT INTO BaiHoc (TieuDe, NoiDung, ThuTu, MaKhoaHoc, TrangThai) VALUES
(N'Giới thiệu tiếng Anh cơ bản', N'Giới thiệu các từ vựng cơ bản và cách chào hỏi.', 1, 1, N'active'),
(N'Hội thoại hàng ngày', N'Thực hành hội thoại giao tiếp thông dụng mỗi ngày.', 2, 1, N'active'),
(N'Viết email thương mại', N'Rèn luyện viết email chuyên nghiệp trong môi trường công việc.', 1, 2, N'active');

INSERT INTO CauHoi (MaBaiHoc, NoiDung, LoaiCauHoi, ThuTu) VALUES
(1, N'Bài học này thuộc chủ đề nào?', N'multiple_choice', 1),
(1, N'Chọn câu chào hỏi đúng.', N'multiple_choice', 2),
(3, N'Câu nào là lời mở đầu email trang trọng?', N'multiple_choice', 1);

INSERT INTO DapAn (MaCauHoi, NoiDung, LaDapAnDung) VALUES
(1, N'Tiếng Anh cơ bản', 1),
(1, N'Tiếng Anh nâng cao', 0),
(1, N'Tiếng Anh giao tiếp', 0),
(2, N'Chào buổi sáng', 1),
(2, N'Ê, anh bạn', 0),
(3, N'Kính gửi chị Thủy, tôi hy vọng chị vẫn khỏe.', 1),
(3, N'Chào bạn!', 0);

INSERT INTO BaiKiemTra (MaLop, TenBaiKiemTra, ThoiGianLam, DiemDat, TrangThai) VALUES
(1, N'Kiểm tra nhỏ 1', 30, 7.50, N'active'),
(2, N'Bài kiểm tra thương mại', 45, 8.00, N'active');

INSERT INTO DangKyLop (MaHocVien, MaLop, NgayDangKy, TrangThai) VALUES
(1, 1, N'2026-01-12', N'approved'),
(2, 1, N'2026-01-13', N'approved'),
(3, 1, N'2026-01-14', N'pending'),
(4, 2, N'2026-02-02', N'approved'),
(5, 2, N'2026-02-03', N'approved');

INSERT INTO ChuyenCan (MaHocVien, MaLop, NgayDiem, TrangThai, GhiChu) VALUES
(1, 1, N'2026-01-15', N'Có', N'Đi học đầy đủ'),
(2, 1, N'2026-01-15', N'Vắng', N'Có phép'),
(4, 2, N'2026-02-05', N'Có', N'Đi học đúng giờ');

INSERT INTO TienDoHocTap (MaHocVien, MaBaiHoc, PhanTramHoanThanh, NgayCapNhat) VALUES
(1, 1, 100.00, N'2026-01-16'),
(1, 2, 60.00, N'2026-01-20'),
(2, 1, 80.00, N'2026-01-18'),
(4, 3, 50.00, N'2026-02-06');

INSERT INTO DanhGiaHocVien (MaHocVien, MaGiaoVien, DiemDanhGia, NhanXet, NgayDanhGia) VALUES
(1, 1, 4.80, N'Học viên có tiến bộ tốt trong giao tiếp cơ bản.', N'2026-01-22'),
(4, 2, 4.50, N'Học viên chủ động và làm bài đầy đủ.', N'2026-02-07');
