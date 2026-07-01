import 'package:flutter/material.dart';

import '../screens/auth/giao_dien_dang_nhap.dart';
import '../screens/auth/giao_dien_dang_ky.dart';
import '../screens/home/giao_dien_quan_tri_vien.dart';
import '../screens/home/giao_dien_chung.dart';
import '../screens/home/giao_dien_hoc_vien.dart';
import '../screens/home/giao_dien_giao_vien.dart';
import '../screens/student/giao_dien_chi_tiet_khoa_hoc.dart';
import '../screens/student/giao_dien_tien_do_hoc_tap.dart';
import '../screens/student/giao_dien_ho_so.dart';
import '../screens/student/giao_dien_bai_keo_tha.dart';

class AppRoutes {
  static const String login = '/';
  static const String register = '/register';
  static const String home = '/home';
  static const String adminHome = '/admin';
  static const String teacherHome = '/teacher';
  static const String studentHome = '/student';
  static const String lessonDragMatch = '/student/lesson-drag-match';
  static const String profile = '/student/profile';
  static const String progress = '/student/progress';
  static const String courseDetail = '/student/course-detail';

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    home: (context) => const GiaoDienChung(),
    adminHome: (context) => const GiaoDienQuanTriVien(),
    teacherHome: (context) => const GiaoDienGiaoVien(),
    studentHome: (context) => const GiaoDienHocVien(),
    lessonDragMatch: (context) => const LessonDragMatchScreen(),
    profile: (context) => const ProfileScreen(),
    progress: (context) => const LearningProgressScreen(),
    courseDetail: (context) => const CourseDetailScreen(course: {}),
  };

}