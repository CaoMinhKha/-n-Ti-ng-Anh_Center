import 'package:flutter/material.dart';

class StudentCourseExplorerScreen extends StatelessWidget {
  const StudentCourseExplorerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final courses = [
      {'title': 'Tiếng Anh 1', 'level': 'Cấp 1', 'schedule': 'Sáng - Thứ 2,4,6', 'color': const Color(0xFF4B8AF7)},
      {'title': 'Tiếng Anh 2', 'level': 'Cấp 2', 'schedule': 'Chiều - Thứ 3,5,7', 'color': const Color(0xFF34D399)},
      {'title': 'Tiếng Anh 3', 'level': 'Cấp 3', 'schedule': 'Tối - Chủ nhật', 'color': const Color(0xFFF59E0B)},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Khám phá khóa học')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: courses.length,
        itemBuilder: (context, index) {
          final item = courses[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 14),
            child: ListTile(
              leading: CircleAvatar(backgroundColor: item['color'] as Color, child: const Icon(Icons.menu_book, color: Colors.white)),
              title: Text(item['title'] as String),
              subtitle: Text('${item['level']} • ${item['schedule']}'),
              trailing: ElevatedButton(onPressed: () {}, child: const Text('Đăng ký')),
            ),
          );
        },
      ),
    );
  }
}
