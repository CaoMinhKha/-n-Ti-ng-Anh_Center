// src/app.ts

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

// Auth
import authRoutes from './modules/auth/routes/auth.routes.js';

// Module 1: Danh mục
import danhmucRoutes from './modules/danhmuc/routes/danhmuc.routes.js';

// Module 2: Tài khoản
import taikhoanRoutes from './modules/taikhoan/routes/taikhoan.routes.js';

// Module 3: Khóa học
import khoahocRoutes from './modules/khoahoc/routes/khoahoc.routes.js';
import baihocRoutes from './modules/khoahoc/routes/baihoc.routes.js';
import phanbaihocRoutes from './modules/khoahoc/routes/phanbaihoc.routes.js';
import baikiemtraRoutes from './modules/khoahoc/routes/baikiemtra.routes.js';

// Module 4: Câu hỏi
import cauhoiRoutes from './modules/cauhoi/routes/cauhoi.routes.js';
import dapanRoutes from './modules/cauhoi/routes/dapan.routes.js';

// Module 5: Đợt khai giảng
import dotkhaigiangRoutes from './modules/dotkhaigiang/routes/dotkhaigiang.routes.js';

// Module 6: Lớp học
import lophocRoutes from './modules/lophoc/routes/lophoc.routes.js';

// Module 7: Lịch học
import cahocRoutes from './modules/lichhoc/routes/cahoc.routes.js';
import phonghocRoutes from './modules/lichhoc/routes/phonghoc.routes.js';
import lichhocRoutes from './modules/lichhoc/routes/lichhoc.routes.js';

// Module 8: Điểm danh
import diemdanhRoutes from './modules/diemdanh/routes/diemdanh.routes.js';

// Module 9: Bài làm
import bailamRoutes from './modules/bailam/routes/bailam.routes.js';

// Module 10: Kết quả học tập
import ketquaRoutes from './modules/ketqua/routes/ketqua.routes.js';

// Module 11: Báo cáo thống kê
import adminReportRoutes from './modules/reports/routes/admin-report.routes.js';
import teacherReportRoutes from './modules/reports/routes/teacher-report.routes.js';
import studentReportRoutes from './modules/reports/routes/student-report.routes.js';

import { errorHandler } from './middleware/error.middleware.js';
import { setupSwagger } from './config/swagger.js';

dotenv.config();

const app = express();

/// ==================================================
// CORS
// ==================================================
// ==================================================
// CORS
// ==================================================
app.use(cors({
  origin: "*", // ✅ Cho phép tất cả domain gọi API
  credentials: true, // Cho phép gửi cookie/token
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Cookie',
    'X-Requested-With'
  ],
  exposedHeaders: ['Set-Cookie'],
}));

// ==================================================
// Middleware
// ==================================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==================================================
// Swagger Documentation
// ==================================================
setupSwagger(app);

// ==================================================
// Routes
// ==================================================

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ==================================================
// MODULE AUTH
// ==================================================
app.use('/api/auth', authRoutes);

// ==================================================
// MODULE 1: DANH MỤC
// ==================================================
app.use('/api/danhmuc', danhmucRoutes);

// ==================================================
// MODULE 2: TÀI KHOẢN
// ==================================================
app.use('/api/taikhoan', taikhoanRoutes);

// ==================================================
// MODULE 3: KHÓA HỌC
// ==================================================
app.use('/api/khoahoc', khoahocRoutes);    // /api/khoahoc
app.use('/api/baihoc', baihocRoutes);      // /api/baihoc
app.use('/api', phanbaihocRoutes);          // /api/baihoc/...
app.use('/api', baikiemtraRoutes);          // /api/baikiemtra

// ==================================================
// MODULE 4: CÂU HỎI
// ==================================================
app.use('/api/cauhoi', cauhoiRoutes);
app.use('/api', dapanRoutes);

// ==================================================
// MODULE 5: ĐỢT KHAI GIẢNG
// ==================================================
app.use('/api/dotkhaigiang', dotkhaigiangRoutes);

// ==================================================
// MODULE 6: LỚP HỌC
// ==================================================
app.use('/api/lophoc', lophocRoutes);

// ==================================================
// MODULE 7: LỊCH HỌC
// ==================================================
app.use('/api/cahoc', cahocRoutes);
app.use('/api/phonghoc', phonghocRoutes);
app.use('/api/lichhoc', lichhocRoutes);

// ==================================================
// MODULE 8: ĐIỂM DANH
// ==================================================
app.use('/api/diemdanh', diemdanhRoutes);

// ==================================================
// MODULE 9: BÀI LÀM
// ==================================================
app.use('/api/bailam', bailamRoutes);

// ==================================================
// MODULE 10: KẾT QUẢ HỌC TẬP
// ==================================================
app.use('/api/ketqua', ketquaRoutes);

// ==================================================
// MODULE 11: BÁO CÁO THỐNG KÊ
// ==================================================
// Admin
app.use('/api/reports/admin', adminReportRoutes);
// Giáo viên
app.use('/api/reports/teacher', teacherReportRoutes);
// Học viên
app.use('/api/reports/student', studentReportRoutes);

// ==================================================
// Error Handler
// ==================================================
app.use(errorHandler);

export default app;