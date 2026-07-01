import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';

class AdminClassScreen extends StatefulWidget {
  const AdminClassScreen({super.key});

  @override
  State<AdminClassScreen> createState() => _AdminClassScreenState();
}

class _AdminClassScreenState extends State<AdminClassScreen> {
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
      appBar: AppBar(title: const Text('Danh sách lớp học')),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
              itemCount: classes.length,
              itemBuilder: (context, index) {
                final item = classes[index];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: ListTile(
                    title: Text(item['TenLop']?.toString() ?? 'Lớp chưa tên'),
                    subtitle: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Khóa: ${item['MaKhoaHoc'] ?? ''}'),
                        Text('Giáo viên: ${item['MaGiaoVien'] ?? 'Chưa phân công'}'),
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
