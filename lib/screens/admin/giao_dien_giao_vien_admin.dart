import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_giao_vien.dart';

class AdminTeacherScreen extends StatefulWidget {
  const AdminTeacherScreen({super.key});

  @override
  State<AdminTeacherScreen> createState() => _AdminTeacherScreenState();
}

class _AdminTeacherScreenState extends State<AdminTeacherScreen> {
  List teachers = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadTeachers();
  }

  Future<void> loadTeachers() async {
    final data = await TeacherService.getTeachers();
    if (mounted) {
      setState(() {
        teachers = data;
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách giáo viên')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: teachers.length,
              itemBuilder: (context, index) {
                final teacher = teachers[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: ListTile(
                    title: Text(teacher['HoTen']?.toString() ?? 'Không tên'),
                    subtitle: Text('Tài khoản: ${teacher['TenDangNhap'] ?? ''}'),
                    trailing: Text('Trạng thái: ${teacher['TrangThai'] ?? ''}'),
                  ),
                );
              },
            ),
    );
  }
}
