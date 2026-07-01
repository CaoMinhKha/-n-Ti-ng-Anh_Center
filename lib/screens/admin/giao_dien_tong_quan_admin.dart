import 'package:flutter/material.dart';

class AdminDashboardScreen extends StatelessWidget {
  const AdminDashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard Admin'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Chào mừng Admin', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Text('- Quản lý tài khoản'),
            Text('- Quản lý giáo viên'),
            Text('- Quản lý học viên'),
            Text('- Quản lý khóa học'),
            Text('- Quản lý lớp học'),
            Text('- Quản lý bài học'),
            Text('- Quản lý câu hỏi'),
            Text('- Quản lý bài kiểm tra'),
            Text('- Báo cáo thống kê'),
          ],
        ),
      ),
    );
  }
}
