import 'package:flutter/material.dart';
import '../../services/course_service.dart';
import '../../services/course_register_service.dart';
import '../../utils/user_session.dart';

class CourseScreen extends StatefulWidget {
  const CourseScreen({super.key});

  @override
  State<CourseScreen> createState() => _CourseScreenState();
}

class _CourseScreenState extends State<CourseScreen> {

  List courses = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadData();
  }

  Future<void> loadData() async {
    final data = await CourseService.getCourses();

    setState(() {
      courses = data;
      loading = false;
    });

    print("COURSES LOADED: ${courses.length}");
  }

  Future<void> register(int maKhoaHoc) async {

    print("CLICK REGISTER: $maKhoaHoc");

    final maHV = await UserSession.getMaHocVien();

    print("MAHV = $maHV");

    if (!mounted) return;

    if (maHV == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Chưa đăng nhập")),
      );
      return;
    }

    final result = await CourseRegisterService.registerCourse(
      maHocVien: maHV,
      maKhoaHoc: maKhoaHoc,
    );

    print("RESULT FROM API = $result");

    if (!mounted) return;

    final res = result.toString().trim();

    if (res == "success") {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Đăng ký thành công")),
      );
    }

    else if (res == "exist") {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Bạn đã đăng ký rồi")),
      );
    }

    else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Đăng ký thất bại: $res")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text("Khóa học")),

      body: loading
          ? const Center(child: CircularProgressIndicator())

          : ListView.builder(
              itemCount: courses.length,

              itemBuilder: (context, index) {

                final item = courses[index];

                return Card(
                  margin: const EdgeInsets.all(10),

                  child: ListTile(
                    leading: const CircleAvatar(
                      child: Icon(Icons.menu_book),
                    ),

                    title: Text(
                      item["TenKhoaHoc"]?.toString() ?? "No name",
                    ),

                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Trình độ: ${item["TrinhDo"] ?? ""}"),
                        Text("Trạng thái: ${item["TrangThai"] ?? ""}"),
                      ],
                    ),

                    trailing: ElevatedButton(
                      onPressed: () async {
                        await register(int.parse(item["MaKhoaHoc"].toString()));
                      },
                      child: const Text("Đăng ký"),
                    ),
                  ),
                );
              },
            ),
    );
  }
}