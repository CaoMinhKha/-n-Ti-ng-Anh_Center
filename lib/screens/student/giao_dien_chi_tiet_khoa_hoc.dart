import 'package:flutter/material.dart';

class CourseDetailScreen extends StatelessWidget {
  final Map<String, dynamic> course;

  const CourseDetailScreen({super.key, required this.course});

  @override
  Widget build(BuildContext context) {
    final title = course['TenKhoaHoc']?.toString() ?? 'Chi tiết khóa học';
    final level = course['TrinhDo']?.toString() ?? 'Không xác định';
    final status = course['TrangThai']?.toString() ?? 'Chưa có';
    final description = course['MoTa']?.toString() ?? 'Mô tả khóa học chưa cập nhật.';

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _detailRow('Trình độ', level),
                    const SizedBox(height: 10),
                    _detailRow('Trạng thái', status),
                    const SizedBox(height: 14),
                    const Text('Mô tả khóa học', style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Text(description),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Chức năng đăng ký khóa học sẽ được xử lý ở màn hình phù hợp.')),
                );
              },
              icon: const Icon(Icons.app_registration),
              label: const Text('Đăng ký khóa học'),
              style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _detailRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.w600)),
        Text(value),
      ],
    );
  }
}
