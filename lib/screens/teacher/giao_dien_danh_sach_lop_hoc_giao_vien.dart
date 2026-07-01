import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';

class TeacherClassListScreen extends StatefulWidget {
  const TeacherClassListScreen({super.key});

  @override
  State<TeacherClassListScreen> createState() => _TeacherClassListScreenState();
}

class _TeacherClassListScreenState extends State<TeacherClassListScreen> {
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
      appBar: AppBar(title: const Text('Lớp giảng dạy')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: classes.length,
              itemBuilder: (context, index) {
                final item = classes[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
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
