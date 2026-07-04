import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';

class TeacherClassListScreen extends StatefulWidget {
  const TeacherClassListScreen({super.key});

  @override
  State<TeacherClassListScreen> createState() => _TeacherClassListScreenState();
}

class _TeacherClassListScreenState extends State<TeacherClassListScreen> {
  List<dynamic> classes = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadClasses();
  }

  Future<void> loadClasses() async {
    setState(() => loading = true);
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
        title: const Text('Lớp giảng dạy'),
        backgroundColor: Colors.blue.shade700,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: loadClasses,
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: classes.length,
                itemBuilder: (context, index) {
                  final item = classes[index];
                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.green.shade50,
                        child: const Icon(Icons.class_, color: Colors.green),
                      ),
                      title: Text(item['TenLop']?.toString() ?? 'Lớp chưa tên', style: const TextStyle(fontWeight: FontWeight.bold)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 6),
                          Text('Khóa học: ${item['MaKhoaHoc'] ?? 'Chưa cập nhật'}'),
                          Text('Giáo viên phụ trách: ${item['MaGiaoVien'] ?? 'Chưa phân công'}'),
                        ],
                      ),
                      trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                    ),
                  );
                },
              ),
            ),
    );
  }
}
