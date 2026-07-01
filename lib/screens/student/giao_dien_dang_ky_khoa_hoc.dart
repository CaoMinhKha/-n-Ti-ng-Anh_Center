import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../dich_vu/dich_vu_dang_ky_khoa_hoc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

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
    if (!mounted || maHV == null) return;

    final result = await CourseRegisterService.registerCourse(
      maHocVien: maHV,
      maKhoaHoc: maKhoaHoc,
    );

    final message = result == 'success'
        ? 'Đăng ký thành công'
        : result == 'exist'
            ? 'Bạn đã đăng ký rồi'
            : 'Đăng ký thất bại: $result';

    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(message)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng ký khóa học')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: courses.length,
              itemBuilder: (context, index) {
                final item = courses[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: ListTile(
                    title: Text(item['TenKhoaHoc']?.toString() ?? 'Không tên'),
                    subtitle: Text('Trình độ: ${item['TrinhDo'] ?? ''}'),
                    trailing: ElevatedButton(
                      onPressed: () async {
                        await registerCourse(int.parse(item['MaKhoaHoc'].toString()));
                      },
                      child: const Text('Đăng ký'),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
