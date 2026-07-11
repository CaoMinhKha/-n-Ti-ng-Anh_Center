import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';

class LearningProgressScreen extends StatelessWidget {
  const LearningProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final progressItems = [
      {
        'title': 'Khóa tiếng Anh giao tiếp',
        'subtitle': 'Tập trung kỹ năng nói và phản xạ',
        'progress': 0.72,
        'color': Colors.blue,
      },
      {
        'title': 'Ngữ pháp cơ bản',
        'subtitle': 'Củng cố cấu trúc câu và thì cơ bản',
        'progress': 0.45,
        'color': Colors.deepPurple,
      },
      {
        'title': 'Từ vựng nâng cao',
        'subtitle': 'Mở rộng từ vựng theo chủ đề',
        'progress': 0.35,
        'color': Colors.green,
      },
    ];

    final summaryItems = [
      {'label': 'Bài học hoàn thành', 'value': '12/20'},
      {'label': 'Bài kiểm tra đã làm', 'value': '5/8'},
      {'label': 'Điểm trung bình', 'value': '8.5/10'},
    ];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Tiến độ học tập'),
        backgroundColor: Colors.blue.shade700,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF3D5AFE), Color(0xFF5C6BC0)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.08),
                    blurRadius: 18,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Tiến độ học tập', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Theo dõi tiến trình và quay lại bài tập để cải thiện.', style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 20),
                  LinearProgressIndicator(value: 0.52, color: Colors.white, backgroundColor: Colors.white24, minHeight: 10),
                  const SizedBox(height: 12),
                  const Text('52% hoàn thành', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text('Khóa học đang theo dõi', style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Column(
              children: progressItems.map((item) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _progressCard(
                    item['title'] as String,
                    item['subtitle'] as String,
                    item['progress'] as double,
                    item['color'] as Color,
                    onTap: () => Navigator.pushNamed(context, AppRoutes.lessonDragMatch),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),
            const Text('Tổng quan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  children: summaryItems.map((item) {
                    return Column(
                      children: [
                        _SummaryRow(label: item['label'] as String, value: item['value'] as String),
                        if (item != summaryItems.last) const Divider(),
                      ],
                    );
                  }).toList(),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              color: Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('Mẹo học tốt', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 10),
                    Text(
                      '• Hoàn thành ít nhất 1 bài học mỗi ngày để duy trì phản xạ.\n'
                      '• Làm lại bài kiểm tra khi chưa đạt 80%.\n'
                      '• Duy trì lịch học 20 phút mỗi ngày.',
                      style: TextStyle(height: 1.5),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _progressCard(String title, String subtitle, double progress, Color color, {required VoidCallback onTap}) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      elevation: 4,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 10,
                    height: 50,
                    decoration: BoxDecoration(
                      color: color,
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 6),
                        Text(subtitle, style: const TextStyle(color: Colors.black54)),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.black45),
                ],
              ),
              const SizedBox(height: 16),
              LinearProgressIndicator(value: progress, color: color, backgroundColor: color.withAlpha(40), minHeight: 10),
              const SizedBox(height: 10),
              Text('${(progress * 100).round()}% hoàn thành', style: const TextStyle(color: Colors.black54)),
            ],
          ),
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;

  const _SummaryRow({required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 16)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        ],
      ),
    );
  }
}
