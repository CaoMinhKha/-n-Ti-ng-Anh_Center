import 'package:flutter/material.dart';
import '../screens/auth/giao_dien_dang_nhap.dart';
import '../screens/auth/giao_dien_dang_ky.dart';
import '../screens/auth/giao_dien_xac_thuc_email.dart';
import '../screens/home/giao_dien_quan_tri_vien.dart';
import '../screens/home/giao_dien_hoc_vien.dart';
import '../screens/home/giao_dien_giao_vien.dart';
import '../screens/student/giao_dien_tien_do_hoc_tap.dart';
import '../screens/student/giao_dien_ho_so.dart';
import '../screens/student/giao_dien_lich_hoc.dart';
import '../screens/student/giao_dien_bai_tap_tong_hop.dart';
import '../screens/student/giao_dien_chuyen_can.dart';
import '../screens/student/giao_dien_danh_gia.dart';
import '../screens/student/giao_dien_tra_tu.dart';
import '../screens/student/giao_dien_chi_tiet_khoa_hoc.dart';
import '../screens/student/giao_dien_dang_ky_lop.dart';
import '../screens/student/giao_dien_noi_dung_bai_hoc.dart';
import '../screens/teacher/giao_dien_chi_tiet_lop_giao_vien.dart';
import '../screens/teacher/giao_dien_danh_sach_lop_hoc_giao_vien.dart';

class AppRoutes {
  static const String login = '/';
  static const String register = '/register';
  static const String verifyEmail = '/verify-email';
  static const String studentHome = '/student-home';
  static const String teacherHome = '/teacher-home';
  static const String adminHome = '/admin-home';
  static const String profile = '/profile';
  static const String progress = '/progress';
  static const String schedule = '/schedule';
  static const String attendance = '/attendance';
  static const String evaluation = '/evaluation';
  static const String dictionary = '/dictionary';
  static const String courseDetail = '/course-detail';
  static const String exercise = '/exercise';
  static const String registerClass = '/register-class';
  static const String lessonContent = '/lesson-content';
  static const String teacherClasses = '/teacher-classes';

  static Map<String, WidgetBuilder> routes = {
    login: (context) => const LoginScreen(),
    register: (context) => const RegisterScreen(),
    verifyEmail: (context) {
      final email = ModalRoute.of(context)?.settings.arguments as String? ?? '';
      return VerifyEmailScreen(email: email);
    },
    studentHome: (context) => const GiaoDienHocVien(),
    teacherHome: (context) => const GiaoDienGiaoVien(),
    adminHome: (context) => const GiaoDienQuanTriVien(),
    profile: (context) => const ProfileScreen(),
    progress: (context) => const LearningProgressScreen(),
    schedule: (context) => const StudentScheduleScreen(),
    attendance: (context) => const AttendanceScreen(),
    evaluation: (context) => const StudentEvaluationScreen(),
    dictionary: (context) => const DictionaryScreen(),
    courseDetail: (context) {
      final course = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>? ?? {};
      return CourseDetailScreen(course: course);
    },
    registerClass: (context) {
      final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>? ?? {};
      return RegisterClassScreen(courseId: args['id'], courseName: args['tenKhoaHoc']);
    },
    lessonContent: (context) {
      final lesson = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>? ?? {};
      return LessonContentScreen(lesson: lesson);
    },
    exercise: (context) {
      final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>? ?? {};
      return ExerciseScreen(lessonId: args['id'] ?? 0, title: args['tieuDe'] ?? 'Bài tập');
    },
    teacherClasses: (context) => const TeacherClassListScreen(),
  };
}
