import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_giao_vien.dart';

class AdminTeacherScreen extends StatefulWidget {
  const AdminTeacherScreen({super.key});

  @override
  State<AdminTeacherScreen> createState() => _AdminTeacherScreenState();
}

class _AdminTeacherScreenState extends State<AdminTeacherScreen> {
  List<dynamic> teachers = [];
  bool loading = true;
  String query = '';

  @override
  void initState() {
    super.initState();
    loadTeachers();
  }

  Future<void> loadTeachers() async {
    try {
      setState(() => loading = true);
      final data = await TeacherService.getTeachers();

      if (mounted) {
        setState(() {
          teachers = data;
          loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          loading = false;
          teachers = [];
        });
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Lỗi tải giáo viên: $e')),
        );
      }
    }
  }

  List<dynamic> get filteredTeachers {
    final lowerQuery = query.toLowerCase();
    if (lowerQuery.isEmpty) {
      return teachers;
    }

    return teachers.where((teacher) {
      final name = (teacher['HoTen'] ?? '').toString().toLowerCase();
      final email = (teacher['Email'] ?? '').toString().toLowerCase();
      final username = (teacher['TenDangNhap'] ?? '').toString().toLowerCase();
      return name.contains(lowerQuery) || email.contains(lowerQuery) || username.contains(lowerQuery);
    }).toList();
  }

  void deleteTeacher(int index) {
    final teacher = filteredTeachers[index];
    final teacherId = teacher['id'] ?? teacher['MaGiaoVien'] ?? teacher['TenDangNhap'];

    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Xóa giáo viên'),
        content: Text('Bạn có chắc muốn xóa ${teacher['HoTen'] ?? 'giáo viên'}?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                if (teacherId != null) {
                  teachers.removeWhere((item) =>
                      item['id'] == teacherId || item['MaGiaoVien'] == teacherId || item['TenDangNhap'] == teacherId);
                } else {
                  teachers.remove(teacher);
                }
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Đã xóa giáo viên khỏi danh sách')),
              );
            },
            child: const Text('Xóa'),
          ),
        ],
      ),
    );
  }

  Widget teacherCard(dynamic teacher, int index) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 28,
                  backgroundColor: Colors.blue.shade50,
                  child: const Icon(Icons.school, color: Colors.blue),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        teacher['HoTen']?.toString() ?? 'Chưa có tên',
                        style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 4),
                      Text(teacher['Email']?.toString() ?? 'Chưa có email', style: const TextStyle(color: Colors.grey)),
                      const SizedBox(height: 4),
                      Text('Tài khoản: ${teacher['TenDangNhap'] ?? ''}'),
                      const SizedBox(height: 4),
                      Text('SĐT: ${teacher['SoDienThoai'] ?? 'Chưa cập nhật'}'),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                OutlinedButton.icon(
                  onPressed: () {},
                  icon: const Icon(Icons.edit, size: 18),
                  label: const Text('Sửa'),
                ),
                const SizedBox(width: 8),
                ElevatedButton.icon(
                  onPressed: () => deleteTeacher(index),
                  icon: const Icon(Icons.delete, size: 18),
                  label: const Text('Xóa'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade600),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final visibleTeachers = filteredTeachers;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Quản lý giáo viên'),
        backgroundColor: Colors.blue.shade700,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: loadTeachers,
              child: ListView(
                padding: const EdgeInsets.all(12),
                children: [
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.blue.shade50,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.school, color: Colors.blue),
                        const SizedBox(width: 10),
                        Expanded(child: Text('Danh sách giáo viên từ API (${visibleTeachers.length})')),
                      ],
                    ),
                  ),
                  const SizedBox(height: 12),
                  TextField(
                    decoration: const InputDecoration(
                      prefixIcon: Icon(Icons.search),
                      hintText: 'Tìm giáo viên theo tên hoặc email',
                      border: OutlineInputBorder(),
                    ),
                    onChanged: (value) => setState(() => query = value),
                  ),
                  const SizedBox(height: 12),
                  if (visibleTeachers.isEmpty)
                    const Padding(
                      padding: EdgeInsets.only(top: 80),
                      child: Center(child: Text('Không có giáo viên phù hợp')),
                    )
                  else
                    ...visibleTeachers.asMap().entries.map((entry) => teacherCard(entry.value, entry.key)),
                ],
              ),
            ),
    );
  }
}