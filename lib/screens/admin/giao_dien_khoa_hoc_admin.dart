import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';

class AdminCourseScreen extends StatefulWidget {
  const AdminCourseScreen({super.key});

  @override
  State<AdminCourseScreen> createState() => _AdminCourseScreenState();
}

class _AdminCourseScreenState extends State<AdminCourseScreen> {
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách khóa học')),
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
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Trình độ: ${item['TrinhDo'] ?? ''}'),
                        Text('Trạng thái: ${item['TrangThai'] ?? ''}'),
                      ],
                    ),
                  ),
                );
              },
            ),
    );
  }
}
