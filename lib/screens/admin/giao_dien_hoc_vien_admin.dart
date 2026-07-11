import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_hoc_vien.dart';

class AdminStudentScreen extends StatefulWidget {
  const AdminStudentScreen({super.key});

  @override
  State<AdminStudentScreen> createState() => _AdminStudentScreenState();
}

class _AdminStudentScreenState extends State<AdminStudentScreen> {
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
          : LayoutBuilder(
              builder: (context, constraints) {
                return ConstrainedBox(
                  constraints: BoxConstraints(minHeight: constraints.maxHeight),
                  child: ListView.builder(
                    physics: const AlwaysScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    itemCount: students.length,
                    itemBuilder: (context, index) {
                      final student = students[index];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        child: ListTile(
                          title: Text(student['HoTen']?.toString() ?? 'Không tên'),
                          subtitle: Text('Tài khoản: ${student['TenDangNhap'] ?? ''}'),
                          trailing: Text('Trạng thái: ${student['TrangThai'] ?? ''}'),
                        ),
                      );
                    },
                  ),
                );
              },
            ),
    );
  }
}

