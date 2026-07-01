import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';

class StudentClassListScreen extends StatefulWidget {
  const StudentClassListScreen({super.key});

  @override
  State<StudentClassListScreen> createState() => _StudentClassListScreenState();
}

class _StudentClassListScreenState extends State<StudentClassListScreen> {
  List classes = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadClasses();
  }

  Future<void> loadClasses() async {
    final data = await ClassService.getClasses();
    if (mounted) {
      setState(() {
        classes = data;
        loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh sách lớp học'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: classes.length,
              itemBuilder: (context, index) {
                final item = classes[index];
                return Card(
                  margin: const EdgeInsets.all(10),
                  child: ListTile(
                    title: Text(item['TenLop'] ?? 'Lớp chưa tên'),
                    subtitle: Text('Khóa: ${item['MaKhoaHoc'] ?? ''} - GV: ${item['MaGiaoVien'] ?? 'Chưa phân công'}'),
                  ),
                );
              },
            ),
    );
  }
}
