import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_hoc_vien.dart';

class TeacherStudentListScreen extends StatefulWidget {
  const TeacherStudentListScreen({super.key});

  @override
  State<TeacherStudentListScreen> createState() => _TeacherStudentListScreenState();
}

class _TeacherStudentListScreenState extends State<TeacherStudentListScreen> {
  List students = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadStudents();
  }

  Future<void> loadStudents() async {
    final data = await StudentService.getStudents();
    if (mounted) {
      setState(() {
        students = data;
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Danh sách học viên')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: students.length,
              itemBuilder: (context, index) {
                final student = students[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: ListTile(
                    title: Text(student['HoTen']?.toString() ?? 'Không tên'),
                    subtitle: Text('Tài khoản: ${student['TenDangNhap'] ?? ''}'),
                    trailing: Text(student['TrangThai']?.toString() ?? ''),
                  ),
                );
              },
            ),
    );
  }
}
