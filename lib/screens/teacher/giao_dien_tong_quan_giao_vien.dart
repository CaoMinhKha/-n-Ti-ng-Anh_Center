import 'package:flutter/material.dart';

class TeacherDashboardScreen extends StatelessWidget {
  const TeacherDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Giáo viên'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Chào mừng Giáo viên', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Text('- Xem lớp được phân công'),
            Text('- Xem danh sách học viên'),
            Text('- Điểm danh'),
            Text('- Quản lý bài học'),
            Text('- Quản lý bài kiểm tra'),
            Text('- Nhập điểm'),
            Text('- Đánh giá học viên'),
            Text('- Xem tiến độ học tập'),
          ],
        ),
      ),
    );
  }
}
