import 'dart:io';
import 'package:flutter/foundation.dart';

class ApiConstants {
  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:5000/api';
    } else if (Platform.isAndroid) {
      return 'http://10.0.2.2:5000/api';
    } else {
      // iOS, Windows, macOS, Linux
      return 'http://localhost:5000/api';
    }
  }
  
  // Auth
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String verifyEmail = '/auth/verify-email';
  static const String me = '/auth/me';

  // Modules
  static const String taiKhoan = '/taikhoan';
  static const String khoaHoc = '/khoahoc';
  static const String lopHoc = '/lophoc';
  static const String lichHoc = '/lichhoc';
  static const String caHoc = '/cahoc';
  static const String phongHoc = '/phonghoc';
  static const String baiHoc = '/baihoc';
  static const String baiKiemTra = '/baikiemtra';
  static const String cauHoi = '/cauhoi';
  static const String diemDanh = '/diemdanh';
  static const String ketQua = '/ketqua';
  static const String danhmuc = '/danhmuc';
  static const String phanBaiHoc = '/phanbaihoc';
  static const String bailam = '/bailam';

  // Reports
  static const String studentDashboard = '/reports/student/dashboard';
  static const String teacherDashboard = '/reports/teacher/dashboard';
  static const String adminDashboard = '/reports/admin/dashboard';
}
