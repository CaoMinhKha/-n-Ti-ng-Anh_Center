import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_hoc_vien.dart';

class TeacherStudentListScreen extends StatefulWidget {
  const TeacherStudentListScreen({super.key});

  @override
  State<TeacherStudentListScreen> createState() => _TeacherStudentListScreenState();
}

class _TeacherStudentListScreenState extends State<TeacherStudentListScreen> {
  List<dynamic> students = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadStudents();
  }

  Future<void> loadStudents() async {
    setState(() => loading = true);
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
      appBar: AppBar(
        title: const Text('Danh sách học viên'),
        backgroundColor: Colors.blue.shade700,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: loadStudents,
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: students.length,
                itemBuilder: (context, index) {
                  final student = students[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.orange.shade50,
                        child: const Icon(Icons.person, color: Colors.orange),
                      ),
                      title: Text(student['HoTen']?.toString() ?? 'Không tên', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Text('Tài khoản: ${student['TenDangNhap'] ?? ''}'),
                          Text('Email: ${student['Email'] ?? 'Chưa có'}'),
                          Text('Trạng thái: ${student['TrangThai'] ?? 'Đang theo dõi'}'),
                        ],
                      ),
                      trailing: const Icon(Icons.chevron_right),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
