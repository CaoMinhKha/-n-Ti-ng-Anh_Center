import 'package:flutter/material.dart';

class LearningProgressScreen extends StatelessWidget {
  const LearningProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Tiến độ học tập'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Tiến độ học tập', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
            const SizedBox(height: 14),
            _progressCard('Khóa tiếng Anh giao tiếp', 0.72, Colors.blue),
            const SizedBox(height: 12),
            _progressCard('Ngữ pháp cơ bản', 0.45, Colors.deepPurple),
            const SizedBox(height: 12),
            _progressCard('Từ vựng nâng cao', 0.35, Colors.green),
            const SizedBox(height: 24),
            const Text('Tổng quan', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: const [
                    _SummaryRow(label: 'Bài học hoàn thành', value: '12/20'),
                    Divider(),
                    _SummaryRow(label: 'Bài kiểm tra đã làm', value: '5/8'),
                    Divider(),
                    _SummaryRow(label: 'Điểm trung bình', value: '8.5/10'),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _progressCard(String title, double progress, Color color) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            LinearProgressIndicator(value: progress, color: color, backgroundColor: color.withAlpha((0.15 * 255).round())),
            const SizedBox(height: 10),
            Text('${(progress * 100).round()}% hoàn thành', style: const TextStyle(color: Colors.black54)),
          ],
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
      padding: const EdgeInsets.symmetric(vertical: 8),
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
