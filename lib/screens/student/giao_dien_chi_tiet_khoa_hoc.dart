import 'package:flutter/material.dart';
import 'package:flutter_tts/flutter_tts.dart';

class CourseDetailScreen extends StatefulWidget {
  final Map<String, dynamic> course;

  const CourseDetailScreen({super.key, required this.course});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final FlutterTts _flutterTts = FlutterTts();
  final List<String> _options = ['to study', 'studied', 'studying', 'study'];
  String? _selectedOption;

  @override
  void initState() {
    super.initState();
    _initTts();
  }

  Future<void> _initTts() async {
    await _flutterTts.setLanguage('en-US');
    await _flutterTts.setPitch(1.0);
    await _flutterTts.setSpeechRate(0.45);
  }

  @override
  void dispose() {
    _flutterTts.stop();
    super.dispose();
  }

  Future<void> _speakExample() async {
    await _flutterTts.speak('I want to study English every day.');
  }

  @override
  Widget build(BuildContext context) {
    final course = widget.course;
    final title = course['TenKhoaHoc']?.toString() ?? 'Chi tiết khóa học';
    final level = course['TrinhDo']?.toString() ?? 'Không xác định';
    final status = course['TrangThai']?.toString() ?? 'Chưa có';
    final description = course['MoTa']?.toString() ?? 'Mô tả khóa học chưa cập nhật.';

    return Scaffold(
      appBar: AppBar(title: Text(title), backgroundColor: Colors.blue.shade700),
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
            const Text('Mini quiz', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 8),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Chọn đáp án đúng cho câu: "I want ___ English every day."', style: TextStyle(fontWeight: FontWeight.w600)),
                    const SizedBox(height: 8),
                    RadioGroup<String>(
                      groupValue: _selectedOption,
                      onChanged: (value) => setState(() => _selectedOption = value),
                      child: Column(
                        children: _options
                            .map((option) => RadioListTile<String>(
                                  title: Text(option),
                                  value: option,
                                ))
                            .toList(),
                      ),
                    ),
                    const SizedBox(height: 8),
                    ElevatedButton(
                      onPressed: () {
                        final isCorrect = _selectedOption == 'to study';
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text(isCorrect ? 'Đúng rồi!' : 'Chưa đúng, đáp án đúng là: to study')),
                        );
                      },
                      child: const Text('Kiểm tra đáp án'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const Text('Bài học mẫu', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.volume_up, color: Colors.blue),
                title: const Text('Phát âm từ vựng'),
                subtitle: const Text('Luyện phát âm cơ bản với API giọng đọc mẫu.'),
                trailing: IconButton(
                  icon: const Icon(Icons.play_circle_fill),
                  onPressed: _speakExample,
                ),
              ),
            ),
            const SizedBox(height: 12),
            Card(
              child: ListTile(
                leading: const Icon(Icons.translate, color: Colors.green),
                title: const Text('Dịch và giải thích'),
                subtitle: const Text('"to study" = học; dùng sau động từ want để chỉ mục đích học tập.'),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Đăng ký khóa học thành công.')),
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
