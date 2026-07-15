import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bai_kiem_tra.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class TakeExamScreen extends StatefulWidget {
  final int examId;
  final String examTitle;

  const TakeExamScreen({super.key, required this.examId, required this.examTitle});

  @override
  State<TakeExamScreen> createState() => _TakeExamScreenState();
}

class _TakeExamScreenState extends State<TakeExamScreen> {
  List<dynamic> _questions = [];
  int _currentQuestionIndex = 0;
  int _score = 0;
  bool _isLoading = true;
  int? _selectedAnswerId;
  bool _isAnswered = false;

  @override
  void initState() {
    super.initState();
    _loadQuestions();
  }

  Future<void> _loadQuestions() async {
    try {
      final data = await ExamService.getQuestions(widget.examId);
      setState(() {
        _questions = data;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải câu hỏi: $e');
      setState(() => _isLoading = false);
    }
  }

  void _checkAnswer(int? answerId, bool isCorrect) {
    if (_isAnswered) return;
    setState(() {
      _selectedAnswerId = answerId;
      _isAnswered = true;
      if (isCorrect) _score++;
    });
  }

  void _nextQuestion() {
    if (_currentQuestionIndex < _questions.length - 1) {
      setState(() {
        _currentQuestionIndex++;
        _selectedAnswerId = null;
        _isAnswered = false;
      });
    } else {
      _finishExam();
    }
  }

  Future<void> _finishExam() async {
    final studentId = await UserSession.getUserId();
    if (studentId != null && _questions.isNotEmpty) {
      await ExamService.submitExam(
        studentId: studentId,
        examId: widget.examId,
        score: (_score / _questions.length) * 10,
        correctAnswers: _score,
        totalQuestions: _questions.length,
      );
    }
    
    if (!mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        title: const Text('Kết quả bài làm'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.emoji_events, size: 60, color: Colors.orange),
            const SizedBox(height: 16),
            Text('Bạn đã đúng $_score/${_questions.length} câu'),
            Text('Điểm: ${((_score / _questions.length) * 10).toStringAsFixed(1)}', 
                 style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue)),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              Navigator.pop(context);
            },
            child: const Text('Hoàn tất'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    if (_questions.isEmpty) return Scaffold(appBar: AppBar(), body: const Center(child: Text('Không có câu hỏi nào')));

    final currentQuestion = _questions[_currentQuestionIndex];
    final answers = currentQuestion['dapan'] as List<dynamic>? ?? currentQuestion['DapAn'] as List<dynamic>? ?? [];

    return Scaffold(
      appBar: AppBar(title: Text(widget.examTitle)),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            LinearProgressIndicator(value: (_currentQuestionIndex + 1) / _questions.length),
            const SizedBox(height: 20),
            Text('Câu hỏi ${_currentQuestionIndex + 1}/${_questions.length}', 
                 style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
            const SizedBox(height: 12),
            Text(currentQuestion['NoiDungText'] ?? currentQuestion['NoiDung'] ?? '', 
                 style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 30),
            Expanded(
              child: ListView.builder(
                itemCount: answers.length,
                itemBuilder: (context, index) {
                  final ans = answers[index];
                  int ansId = int.tryParse((ans['id'] ?? ans['MaDapAn']).toString()) ?? 0;
                  bool isCorrect = ans['laDapAnDung'] == true || ans['LaDapAnDung'] == 1;
                  bool isSelected = _selectedAnswerId == ansId;
                  
                  Color color = Colors.white;
                  if (_isAnswered) {
                    if (isCorrect) color = Colors.green.shade50;
                    else if (isSelected) color = Colors.red.shade50;
                  }

                  return Card(
                    color: color,
                    child: ListTile(
                      title: Text(ans['noiDungText'] ?? ans['NoiDung'] ?? ''),
                      leading: CircleAvatar(child: Text(String.fromCharCode(65 + index))),
                      onTap: () => _checkAnswer(ansId, isCorrect),
                    ),
                  );
                },
              ),
            ),
            if (_isAnswered)
              ElevatedButton(
                onPressed: _nextQuestion,
                child: Text(_currentQuestionIndex == _questions.length - 1 ? 'KẾT THÚC' : 'TIẾP THEO'),
              ),
          ],
        ),
      ),
    );
  }
}
