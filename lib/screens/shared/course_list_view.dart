import 'package:flutter/material.dart';

class CourseListView extends StatelessWidget {
  final bool loading;
  final List courses;
  final String emptyMessage;
  final void Function(int maKhoaHoc)? onRegisterCourse;
  final void Function(Map<String, dynamic> course)? onChooseClass;
  final void Function(Map<String, dynamic> course)? onCourseTap;

  const CourseListView({
    super.key,
    required this.loading,
    required this.courses,
    this.emptyMessage = 'Không có khóa học nào.',
    this.onRegisterCourse,
    this.onChooseClass,
    this.onCourseTap,
  });

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (courses.isEmpty) {
      return Center(
        child: Text(
          emptyMessage,
          style: const TextStyle(fontSize: 16, color: Colors.black54),
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: courses.length,
      itemBuilder: (context, index) {
        final item = courses[index] as Map<String, dynamic>;
        final title = item['TenKhoaHoc']?.toString() ?? 'Khóa học';
        final level = item['TrinhDo']?.toString() ?? '';
        final description = item['MoTa']?.toString() ?? 'Chưa có mô tả.';
        final maKhoaHoc = int.tryParse(item['MaKhoaHoc']?.toString() ?? '') ?? 0;

        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: InkWell(
            borderRadius: BorderRadius.circular(16),
            onTap: onCourseTap != null ? () => onCourseTap!(item) : null,
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const CircleAvatar(child: Icon(Icons.menu_book)),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text('Trình độ: $level'),
                  const SizedBox(height: 4),
                  Text('Mô tả: $description'),
                  const SizedBox(height: 10),
                  Row(
                    children: [
                      if (onRegisterCourse != null)
                        Expanded(
                          child: ElevatedButton(
                            onPressed: maKhoaHoc > 0 ? () => onRegisterCourse!(maKhoaHoc) : null,
                            child: const Text('Đăng ký'),
                          ),
                        ),
                      if (onRegisterCourse != null && onChooseClass != null)
                        const SizedBox(width: 8),
                      if (onChooseClass != null)
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => onChooseClass!(item),
                            child: const Text('Chọn lớp'),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
