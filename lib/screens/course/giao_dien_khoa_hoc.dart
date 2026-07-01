import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../dich_vu/dich_vu_dang_ky_khoa_hoc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

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

    debugPrint("COURSES LOADED: ${courses.length}");
  }

  Future<void> register(int maKhoaHoc) async {

    debugPrint("CLICK REGISTER: $maKhoaHoc");

    final maHV = await UserSession.getMaHocVien();

    debugPrint("MAHV = $maHV");

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

    debugPrint("RESULT FROM API = $result");

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