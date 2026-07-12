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
        final levelColor = level == 'A1'
            ? Colors.green.shade700
            : level == 'A2'
                ? Colors.indigo.shade700
                : level == 'A3'
                    ? Colors.deepPurple.shade700
                    : Colors.blueGrey.shade700;

        return Card(
          elevation: 4,
          color: Colors.white,
          margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: onCourseTap != null ? () => onCourseTap!(item) : null,
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: levelColor.withValues(alpha: 0.16),
                        ),
                        child: Icon(Icons.menu_book, color: levelColor),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Text(
                          title,
                          style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: levelColor.withValues(alpha: 0.12),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text(
                          level,
                          style: TextStyle(color: levelColor, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    description,
                    style: const TextStyle(fontSize: 15, height: 1.5, color: Colors.black87),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      if (onRegisterCourse != null)
                        Expanded(
                          child: ElevatedButton(
                            onPressed: maKhoaHoc > 0 ? () => onRegisterCourse!(maKhoaHoc) : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF5E35B1),
                              foregroundColor: Colors.white,
                              disabledBackgroundColor: Colors.grey.shade300,
                              disabledForegroundColor: Colors.grey.shade700,
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              elevation: 2,
                              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
                            child: const Text('Đăng ký'),
                          ),
                        ),
                      if (onRegisterCourse != null && onChooseClass != null)
                        const SizedBox(width: 10),
                      if (onChooseClass != null)
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => onChooseClass!(item),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF5E35B1),
                              disabledForegroundColor: Colors.grey.shade600,
                              side: const BorderSide(color: Color(0xFF5E35B1)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                              textStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                            ),
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
