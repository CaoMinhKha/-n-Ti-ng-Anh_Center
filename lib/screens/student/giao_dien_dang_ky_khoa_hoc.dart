import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../dich_vu/dich_vu_dang_ky_khoa_hoc.dart';
import '../../thanh_phan/thanh_menu.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../shared/course_list_view.dart';
import 'giao_dien_dang_ky_lop.dart';

class StudentCourseScreen extends StatefulWidget {
  const StudentCourseScreen({super.key});

  @override
  State<StudentCourseScreen> createState() => _StudentCourseScreenState();
}

class _StudentCourseScreenState extends State<StudentCourseScreen> {
  List courses = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadCourses();
  }

  Future<void> loadCourses() async {
    final data = await CourseService.getCourses();
    if (mounted) {
      setState(() {
        courses = data;
        loading = false;
      });
    }
  }

  Future<void> registerCourse(int maKhoaHoc) async {
    final maHV = await UserSession.getMaHocVien();
    if (!mounted) return;

    if (maHV == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng đăng nhập trước khi đăng ký khóa học')),
      );
      return;
    }

    final result = await CourseRegisterService.registerCourse(
      maHocVien: maHV,
      maKhoaHoc: maKhoaHoc,
    );

    if (!mounted) return;

    final message = result == 'success'
        ? 'Đăng ký thành công'
        : result == 'exist'
            ? 'Bạn đã đăng ký rồi'
            : 'Đăng ký thất bại: $result';

    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng ký khóa học')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const RegisterClassScreen()),
          );
        },
        icon: const Icon(Icons.calendar_today),
        label: const Text('Đăng ký lớp'),
      ),
      body: CourseListView(
        loading: loading,
        courses: courses,
        onRegisterCourse: (maKhoaHoc) async {
          await registerCourse(maKhoaHoc);
        },
        onChooseClass: (course) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => RegisterClassScreen(
                maKhoaHoc: int.parse(course['MaKhoaHoc'].toString()),
                courseName: course['TenKhoaHoc']?.toString() ?? '',
              ),
            ),
          );
        },
      ),
    );
  }
}
