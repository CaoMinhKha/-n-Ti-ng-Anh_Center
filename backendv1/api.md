# 📋 TỔNG HỢP TẤT CẢ API THEO MODULE

---

## 🔐 **MODULE AUTH (Xác thực)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | POST | `/api/auth/register` | Đăng ký tài khoản học viên | Public |
| 2 | POST | `/api/auth/verify-email` | Xác thực email OTP | Public |
| 3 | POST | `/api/auth/resend-otp` | Gửi lại OTP | Public |
| 4 | POST | `/api/auth/login` | Đăng nhập | Public |
| 5 | POST | `/api/auth/refresh-token` | Làm mới Access Token | Public |
| 6 | POST | `/api/auth/forgot-password` | Quên mật khẩu | Public |
| 7 | POST | `/api/auth/reset-password` | Đặt lại mật khẩu | Public |
| 8 | POST | `/api/auth/logout` | Đăng xuất | Private |
| 9 | POST | `/api/auth/change-password` | Đổi mật khẩu | Private |
| 10 | GET | `/api/auth/me` | Lấy thông tin user hiện tại | Private |

---

## 📂 **MODULE DANH MỤC (DanhMuc)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/danhmuc` | Lấy danh sách (phân trang, tìm kiếm, lọc, sắp xếp) | Public |
| 2 | GET | `/api/danhmuc/types` | Lấy danh sách loại danh mục (dropdown) | Public |
| 3 | GET | `/api/danhmuc/parents` | Lấy danh sách danh mục cha (dropdown) | Public |
| 4 | GET | `/api/danhmuc/all-options` | Lấy tất cả danh mục (dropdown) | Public |
| 5 | GET | `/api/danhmuc/:id` | Xem chi tiết danh mục | Public |
| 6 | POST | `/api/danhmuc` | Thêm danh mục mới | Admin |
| 7 | PUT | `/api/danhmuc/:id` | Cập nhật danh mục | Admin |
| 8 | DELETE | `/api/danhmuc/:id` | Xóa danh mục | Admin |

---

## 👤 **MODULE TÀI KHOẢN (TaiKhoan)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/taikhoan` | Lấy danh sách tài khoản (phân trang, tìm kiếm, lọc, sắp xếp) | Admin |
| 2 | GET | `/api/taikhoan/roles` | Lấy danh sách role (dropdown) | Admin |
| 3 | GET | `/api/taikhoan/statuses` | Lấy danh sách trạng thái (dropdown) | Admin |
| 4 | GET | `/api/taikhoan/by-role/:role` | Lấy danh sách tài khoản theo role (dropdown) | Admin |
| 5 | GET | `/api/taikhoan/:id` | Xem chi tiết tài khoản | Admin |
| 6 | POST | `/api/taikhoan` | Thêm tài khoản mới | Admin |
| 7 | PUT | `/api/taikhoan/:id` | Cập nhật tài khoản | Admin |
| 8 | PATCH | `/api/taikhoan/:id/toggle-status` | Khóa/Mở khóa tài khoản | Admin |
| 9 | POST | `/api/taikhoan/:id/reset-password` | Đặt lại mật khẩu | Admin |
| 10 | DELETE | `/api/taikhoan/:id` | Xóa tài khoản (xóa mềm) | Admin |

---

## 📚 **MODULE KHÓA HỌC (KhoaHoc)**

### Khóa học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/khoahoc` | Danh sách khóa học (phân trang, tìm kiếm, lọc, sắp xếp) | Public |
| 2 | GET | `/api/khoahoc/options` | Dropdown khóa học | Public |
| 3 | GET | `/api/khoahoc/trinhdo-options` | Dropdown trình độ | Public |
| 4 | GET | `/api/khoahoc/status-options` | Dropdown trạng thái | Public |
| 5 | GET | `/api/khoahoc/:id` | Chi tiết khóa học | Public |
| 6 | POST | `/api/khoahoc` | Thêm khóa học | Admin/GV |
| 7 | PUT | `/api/khoahoc/:id` | Cập nhật khóa học | Admin/GV |
| 8 | DELETE | `/api/khoahoc/:id` | Xóa khóa học | Admin |

### Bài học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 9 | GET | `/api/khoahoc/:khoaHocId/baihoc` | DS bài học của khóa học | Public |
| 10 | GET | `/api/baihoc/:id` | Chi tiết bài học | Public |
| 11 | POST | `/api/khoahoc/:khoaHocId/baihoc` | Thêm bài học | Admin/GV |
| 12 | PUT | `/api/baihoc/:id` | Cập nhật bài học | Admin/GV |
| 13 | PUT | `/api/khoahoc/:khoaHocId/baihoc/order` | Cập nhật thứ tự bài học | Admin/GV |
| 14 | DELETE | `/api/baihoc/:id` | Xóa bài học | Admin/GV |

### Phần bài học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 15 | GET | `/api/baihoc/:baiHocId/phanbaihoc` | DS phần bài học | Public |
| 16 | GET | `/api/phanbaihoc/:id` | Chi tiết phần bài học | Public |
| 17 | POST | `/api/baihoc/:baiHocId/phanbaihoc` | Thêm phần bài học | Admin/GV |
| 18 | PUT | `/api/phanbaihoc/:id` | Cập nhật phần bài học | Admin/GV |
| 19 | PUT | `/api/baihoc/:baiHocId/phanbaihoc/order` | Cập nhật thứ tự phần bài học | Admin/GV |
| 20 | DELETE | `/api/phanbaihoc/:id` | Xóa phần bài học | Admin/GV |

### Bài kiểm tra
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 21 | GET | `/api/baikiemtra/:id` | Chi tiết bài kiểm tra | Public |
| 22 | POST | `/api/phanbaihoc/:phanBaiHocId/baikiemtra` | Thêm bài kiểm tra | Admin/GV |
| 23 | PUT | `/api/baikiemtra/:id` | Cập nhật bài kiểm tra | Admin/GV |
| 24 | DELETE | `/api/baikiemtra/:id` | Xóa bài kiểm tra | Admin/GV |

---

## ❓ **MODULE CÂU HỎI (CauHoi)**

### Câu hỏi
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/cauhoi` | Danh sách câu hỏi (phân trang, tìm kiếm, lọc, sắp xếp) | Public |
| 2 | GET | `/api/cauhoi/types` | Dropdown loại câu hỏi | Public |
| 3 | GET | `/api/cauhoi/status-options` | Dropdown trạng thái | Public |
| 4 | GET | `/api/cauhoi/options` | Dropdown câu hỏi | Public |
| 5 | GET | `/api/cauhoi/:id` | Chi tiết câu hỏi | Public |
| 6 | GET | `/api/cauhoi/:id/children` | Danh sách câu hỏi con | Public |
| 7 | POST | `/api/cauhoi` | Thêm câu hỏi | Admin/GV |
| 8 | PUT | `/api/cauhoi/:id` | Cập nhật câu hỏi | Admin/GV |
| 9 | DELETE | `/api/cauhoi/:id` | Xóa câu hỏi | Admin |

### Đáp án
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 10 | GET | `/api/cauhoi/:cauHoiId/dapan` | Danh sách đáp án của câu hỏi | Public |
| 11 | POST | `/api/cauhoi/:cauHoiId/dapan` | Thêm đáp án | Admin/GV |
| 12 | PUT | `/api/dapan/:id` | Cập nhật đáp án | Admin/GV |
| 13 | DELETE | `/api/dapan/:id` | Xóa đáp án | Admin/GV |

---

## 📅 **MODULE ĐỢT KHAI GIẢNG (DotKhaiGiang)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/dotkhaigiang` | Danh sách đợt khai giảng (phân trang, tìm kiếm, lọc, sắp xếp) | Public |
| 2 | GET | `/api/dotkhaigiang/status-options` | Dropdown trạng thái | Public |
| 3 | GET | `/api/dotkhaigiang/options` | Dropdown đợt khai giảng | Public |
| 4 | GET | `/api/dotkhaigiang/:id` | Chi tiết đợt khai giảng | Public |
| 5 | GET | `/api/dotkhaigiang/ma/:maDot` | Lấy theo mã đợt | Public |
| 6 | POST | `/api/dotkhaigiang` | Thêm đợt khai giảng | Admin |
| 7 | PUT | `/api/dotkhaigiang/:id` | Cập nhật đợt khai giảng | Admin |
| 8 | DELETE | `/api/dotkhaigiang/:id` | Xóa đợt khai giảng | Admin |

---

## 🎓 **MODULE LỚP HỌC (LopHoc)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/lophoc` | Danh sách lớp học (phân trang, tìm kiếm, lọc, sắp xếp) | Public |
| 2 | GET | `/api/lophoc/hinhthuc-options` | Dropdown hình thức học | Public |
| 3 | GET | `/api/lophoc/status-options` | Dropdown trạng thái lớp học | Public |
| 4 | GET | `/api/lophoc/options` | Dropdown lớp học | Public |
| 5 | GET | `/api/lophoc/:id` | Chi tiết lớp học | Public |
| 6 | POST | `/api/lophoc` | Thêm lớp học | Admin |
| 7 | PUT | `/api/lophoc/:id` | Cập nhật lớp học | Admin |
| 8 | DELETE | `/api/lophoc/:id` | Xóa lớp học | Admin |
| 9 | GET | `/api/lophoc/:lopHocId/dangky` | DS đăng ký của lớp | Public |
| 10 | POST | `/api/lophoc/:lopHocId/dangky` | Đăng ký học viên vào lớp | Public |
| 11 | PUT | `/api/lophoc/dangky/:dangKyId/duyet` | Duyệt/Từ chối đăng ký | Admin/GV |

---

## 📆 **MODULE LỊCH HỌC (LichHoc)**

### Ca học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/cahoc` | Danh sách ca học | Public |
| 2 | GET | `/api/cahoc/options` | Dropdown ca học | Public |
| 3 | GET | `/api/cahoc/:id` | Chi tiết ca học | Public |
| 4 | GET | `/api/cahoc/ma/:maCa` | Lấy ca học theo mã | Public |
| 5 | POST | `/api/cahoc` | Thêm ca học | Admin |
| 6 | PUT | `/api/cahoc/:id` | Cập nhật ca học | Admin |
| 7 | DELETE | `/api/cahoc/:id` | Xóa ca học | Admin |

### Phòng học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 8 | GET | `/api/phonghoc` | Danh sách phòng học | Public |
| 9 | GET | `/api/phonghoc/options` | Dropdown phòng học | Public |
| 10 | GET | `/api/phonghoc/status-options` | Dropdown trạng thái phòng | Public |
| 11 | GET | `/api/phonghoc/:id` | Chi tiết phòng học | Public |
| 12 | GET | `/api/phonghoc/ma/:maPhong` | Lấy phòng học theo mã | Public |
| 13 | POST | `/api/phonghoc` | Thêm phòng học | Admin |
| 14 | PUT | `/api/phonghoc/:id` | Cập nhật phòng học | Admin |
| 15 | DELETE | `/api/phonghoc/:id` | Xóa phòng học | Admin |

### Lịch học
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 16 | GET | `/api/lichhoc` | Danh sách lịch học | Public |
| 17 | GET | `/api/lichhoc/lophoc/:lopHocId` | Lịch học của lớp | Public |
| 18 | GET | `/api/lichhoc/status-options` | Dropdown trạng thái lịch | Public |
| 19 | GET | `/api/lichhoc/thu-options` | Dropdown thứ trong tuần | Public |
| 20 | GET | `/api/lichhoc/:id` | Chi tiết lịch học | Public |
| 21 | POST | `/api/lichhoc` | Thêm lịch học | Admin |
| 22 | PUT | `/api/lichhoc/:id` | Cập nhật lịch học | Admin |
| 23 | DELETE | `/api/lichhoc/:id` | Xóa lịch học | Admin |
| 24 | POST | `/api/lichhoc/:id/generate-buoihoc` | Tạo buổi học từ lịch | Admin |

---

## 📋 **MODULE ĐIỂM DANH (DiemDanh)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/diemdanh` | Danh sách điểm danh | Public |
| 2 | GET | `/api/diemdanh/buoihoc/:buoiHocId` | Điểm danh theo buổi học | Public |
| 3 | GET | `/api/diemdanh/hocvien/:hocVienId` | Điểm danh theo học viên | Public |
| 4 | GET | `/api/diemdanh/status-options` | Dropdown trạng thái điểm danh | Public |
| 5 | POST | `/api/diemdanh` | Tạo điểm danh | Public |
| 6 | PUT | `/api/diemdanh/:hocVienId/:buoiHocId` | Cập nhật điểm danh | Public |
| 7 | DELETE | `/api/diemdanh/:hocVienId/:buoiHocId` | Xóa điểm danh | Public |
| 8 | POST | `/api/diemdanh/madiemdanh` | Tạo mã điểm danh | Admin/GV |
| 9 | GET | `/api/diemdanh/madiemdanh/buoihoc/:buoiHocId` | Lấy mã điểm danh của buổi học | Public |
| 10 | POST | `/api/diemdanh/madiemdanh/verify` | Xác thực mã điểm danh | Public |
| 11 | PUT | `/api/diemdanh/madiemdanh/:id/close` | Đóng mã điểm danh | Admin/GV |
| 12 | GET | `/api/diemdanh/madiemdanh/status-options` | Dropdown trạng thái mã điểm danh | Public |

---

## 📝 **MODULE BÀI LÀM (BaiLam)**

| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/bailam` | Danh sách bài làm | Public |
| 2 | GET | `/api/bailam/hocvien/:hocVienId` | Bài làm theo học viên | Public |
| 3 | GET | `/api/bailam/baikiemtra/:baiKiemTraId` | Bài làm theo bài kiểm tra | Public |
| 4 | GET | `/api/bailam/status-options` | Dropdown trạng thái bài làm | Public |
| 5 | GET | `/api/bailam/:id` | Chi tiết bài làm | Public |
| 6 | POST | `/api/bailam` | Tạo bài làm | Public |
| 7 | PUT | `/api/bailam/:id` | Cập nhật bài làm | Public |
| 8 | DELETE | `/api/bailam/:id` | Xóa bài làm | Public |
| 9 | POST | `/api/bailam/:baiLamId/chitiet` | Thêm chi tiết bài làm | Public |
| 10 | PUT | `/api/bailam/:baiLamId/chitiet/:cauHoiId` | Cập nhật chi tiết | Public |
| 11 | DELETE | `/api/bailam/:baiLamId/chitiet/:cauHoiId` | Xóa chi tiết bài làm | Public |

---

## 📊 **MODULE KẾT QUẢ HỌC TẬP (KetQua)**

### Kết quả học tập
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 1 | GET | `/api/ketqua` | Danh sách kết quả học tập | Public |
| 2 | GET | `/api/ketqua/hocvien/:hocVienId` | Kết quả của học viên | Public |
| 3 | GET | `/api/ketqua/lophoc/:lopHocId` | Kết quả của lớp học | Public |
| 4 | GET | `/api/ketqua/xep-loai-options` | Dropdown xếp loại | Public |
| 5 | GET | `/api/ketqua/:id` | Chi tiết kết quả học tập | Public |
| 6 | POST | `/api/ketqua` | Tạo kết quả học tập | Public |
| 7 | PUT | `/api/ketqua/:id` | Cập nhật kết quả học tập | Public |
| 8 | DELETE | `/api/ketqua/:id` | Xóa kết quả học tập | Public |

### Tiến độ học tập
| STT | Method | Endpoint | Mô tả | Auth |
|-----|--------|----------|-------|------|
| 9 | GET | `/api/ketqua/tiendo` | Danh sách tiến độ học tập | Public |
| 10 | GET | `/api/ketqua/tiendo/hocvien/:hocVienId/lophoc/:lopHocId` | Tiến độ của HV theo lớp | Public |
| 11 | GET | `/api/ketqua/tiendo/status-options` | Dropdown trạng thái tiến độ | Public |
| 12 | PUT | `/api/ketqua/tiendo/hocvien/:hocVienId/lophoc/:lopHocId/phanbaihoc/:phanBaiHocId` | Cập nhật tiến độ | Public |

---

## 📊 **TỔNG HỢP SỐ LƯỢNG API**

| STT | Module | Số API | Public | Private |
|-----|--------|--------|--------|---------|
| 1 | Auth | 10 | 7 | 3 |
| 2 | Danh mục | 8 | 5 | 3 |
| 3 | Tài khoản | 10 | 0 | 10 |
| 4 | Khóa học | 24 | 11 | 13 |
| 5 | Câu hỏi | 13 | 7 | 6 |
| 6 | Đợt khai giảng | 8 | 5 | 3 |
| 7 | Lớp học | 11 | 7 | 4 |
| 8 | Lịch học | 24 | 17 | 7 |
| 9 | Điểm danh | 12 | 9 | 3 |
| 10 | Bài làm | 11 | 11 | 0 |
| 11 | Kết quả | 12 | 12 | 0 |
| **Tổng** | **11 Modules** | **143** | **91** | **52** |

---

## 🔑 **Ghi chú phân loại Auth**

| Ký hiệu | Ý nghĩa |
|---------|---------|
| **Public** | Không cần đăng nhập, ai cũng có thể gọi |
| **Private** | Cần đăng nhập (có Access Token hợp lệ) |
| **Admin** | Chỉ Admin mới có quyền |
| **Admin/GV** | Admin và Giáo viên có quyền |

---

## 📂 **Cấu trúc API theo Role**

### Public APIs (91 API)
- Auth: Đăng ký, đăng nhập, OTP, quên mật khẩu
- Danh mục: Xem danh mục
- Khóa học: Xem khóa học, bài học, phần bài học
- Câu hỏi: Xem câu hỏi, đáp án
- Đợt khai giảng: Xem đợt khai giảng
- Lớp học: Xem lớp học, đăng ký
- Lịch học: Xem lịch học
- Điểm danh: Xem điểm danh, xác thực mã
- Bài làm: Xem, tạo bài làm
- Kết quả: Xem kết quả học tập, tiến độ

### Private APIs (52 API)
- Auth: Đổi mật khẩu, logout, getMe
- Tài khoản: Quản lý tài khoản (Admin)
- Khóa học: CRUD (Admin/GV)
- Câu hỏi: CRUD (Admin/GV)
- Đợt khai giảng: CRUD (Admin)
- Lớp học: CRUD, duyệt đăng ký (Admin/GV)
- Lịch học: CRUD, tạo buổi học (Admin)
- Điểm danh: Tạo mã điểm danh (Admin/GV)

---

**Tổng cộng: 143 API cho toàn bộ hệ thống!** 🎉