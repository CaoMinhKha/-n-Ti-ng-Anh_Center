import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_phan_bai_hoc.dart';
import '../../dich_vu/dich_vu_bai_kiem_tra.dart';
import '../../mo_hinh/cau_hoi.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import 'package:flutter_tts/flutter_tts.dart';

class ExerciseScreen extends StatefulWidget {
  final int lessonId;
  final String title;

  const ExerciseScreen({super.key, required this.lessonId, required this.title});

  @override
  State<ExerciseScreen> createState() => _ExerciseScreenState();
}

class _ExerciseScreenState extends State<ExerciseScreen> {
  final FlutterTts _tts = FlutterTts();
  List<CauHoi> _questions = [];
  int _currentIndex = 0;
  bool _isLoading = true;
  int _score = 0;
  int? _submissionId;

  // Logic Sắp xếp
  List<String> _shuffledWords = [];
  List<String> _userSequence = [];

  // Logic Nối cặp
  Map<String, String?> _matchingPairs = {};
  String? _selectedLeft;

  @override
  void initState() {
    super.initState();
    _initData();
  }

  Future<void> _initData() async {
    setState(() => _isLoading = true);
    try {
      final studentId = await UserSession.getUserId();
      final data = await PhanBaiHocService.getQuestions(widget.lessonId);
      _questions = data.map((e) => CauHoi.fromJson(e)).toList();

      if (studentId != null && _questions.isNotEmpty) {
        final res = await ExamService.createSubmission(
          examId: 1, studentId: studentId, classId: 1,
        );
        _submissionId = res['id'] ?? res['BaiLamID'];
      }
      _prepareQuestion();
      setState(() => _isLoading = false);
    } catch (e) {
      debugPrint('Lỗi tải bài tập: $e');
      setState(() => _isLoading = false);
    }
  }

  void _prepareQuestion() {
    if (_questions.isEmpty) return;
    final q = _questions[_currentIndex];
    _userSequence = [];
    _matchingPairs = {};
    _selectedLeft = null;
    
    if (q.loaiCauHoi == 'SAP_XEP') {
      _shuffledWords = (q.noiDungText ?? '').split(' ')..shuffle();
    } else if (q.loaiCauHoi == 'NOI_CAP') {
      for (var ans in q.danhSachDapAn) {
        _matchingPairs[ans.noiDungText ?? ''] = null;
      }
    }
  }

  Future<void> _submit(bool isCorrect, {int? answerId, String? content}) async {
    if (isCorrect) _score++;
    if (_submissionId != null) {
      await ExamService.submitAnswerDetail(
        submissionId: _submissionId!,
        questionId: _questions[_currentIndex].id,
        answerId: answerId,
        content: content,
      );
    }

    if (_currentIndex < _questions.length - 1) {
      setState(() { _currentIndex++; _prepareQuestion(); });
    } else {
      _showResult();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    final q = _questions[_currentIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: Text(widget.title, style: const TextStyle(fontWeight: FontWeight.bold)),
        elevation: 0,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(6),
          child: LinearProgressIndicator(
            value: (_currentIndex + 1) / _questions.length,
            backgroundColor: Colors.blue.shade50,
            valueColor: const AlwaysStoppedAnimation(Color(0xFF2563EB)),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildHeader(q),
            const SizedBox(height: 30),
            _buildInteraction(q),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(CauHoi q) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white, 
        borderRadius: BorderRadius.circular(30),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Column(
        children: [
          if (q.loaiCauHoi == 'NGHE_HIEU') 
            CircleAvatar(
              radius: 40, 
              backgroundColor: Colors.blue.shade50, 
              child: IconButton(icon: const Icon(Icons.volume_up, size: 40, color: Colors.blue), onPressed: () => _tts.speak(q.noiDungText ?? ''))
            ),
          const SizedBox(height: 15),
          Text(q.noiDungText ?? '', textAlign: TextAlign.center, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, height: 1.4)),
          const SizedBox(height: 10),
          Text(_getLoaiText(q.loaiCauHoi), style: const TextStyle(color: Colors.grey, fontSize: 12, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  String _getLoaiText(String loai) {
    switch (loai) {
      case 'SAP_XEP': return 'SẮP XẾP CÁC TỪ THÀNH CÂU ĐÚNG';
      case 'NOI_CAP': return 'KÉO THẢ ĐỂ NỐI CÁC CẶP TƯƠNG ỨNG';
      case 'NGHE_HIEU': return 'NGHE VÀ CHỌN ĐÁP ÁN ĐÚNG';
      case 'DIEN_VAO_CHO_TRONG': return 'ĐIỀN TỪ CÒN THIẾU';
      default: return 'CHỌN ĐÁP ÁN ĐÚNG';
    }
  }

  Widget _buildInteraction(CauHoi q) {
    if (q.loaiCauHoi == 'SAP_XEP') return _buildSorting();
    if (q.loaiCauHoi == 'NOI_CAP') return _buildMatching();
    return _buildChoices(q);
  }

  Widget _buildChoices(CauHoi q) {
    return Column(
      children: q.danhSachDapAn.map((ans) => Container(
        margin: const EdgeInsets.only(bottom: 16),
        width: double.infinity,
        child: ElevatedButton(
          onPressed: () => _submit(ans.laDapAnDung, answerId: ans.id),
          style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white, foregroundColor: Colors.black87, elevation: 0,
            padding: const EdgeInsets.all(22), side: BorderSide(color: Colors.blue.shade50, width: 2),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          ),
          child: Text(ans.noiDungText ?? '', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
        ),
      )).toList(),
    );
  }

  Widget _buildSorting() {
  return Column(
    children: [
      Container(
        width: double.infinity,
        constraints: const BoxConstraints(
          minHeight: 120,
        ),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: Colors.blue.shade100),
        ),
        child: Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _userSequence.map((s) => ActionChip(
            label: Text(
              s,
              style: const TextStyle(
                color: Colors.blue,
                fontWeight: FontWeight.bold,
              ),
            ),
            onPressed: () => setState(() {
              _userSequence.remove(s);
              _shuffledWords.add(s);
            }),
            backgroundColor: Colors.blue.shade50,
          )).toList(),
        ),
      ),
      const SizedBox(height: 30),
      Wrap(
        spacing: 12,
        runSpacing: 12,
        children: _shuffledWords.map((s) => ActionChip(
          label: Text(
            s,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          onPressed: () => setState(() {
            _shuffledWords.remove(s);
            _userSequence.add(s);
          }),
        )).toList(),
      ),
      const SizedBox(height: 50),
      ElevatedButton(
        onPressed: () => _submit(
          true,
          content: _userSequence.join(' '),
        ),
        child: const Text('KIỂM TRA CÂU TRẢ LỜI'),
      ),
    ],
  );
}

  Widget _buildMatching() {
    return Column(
      children: _matchingPairs.keys.map((key) => Padding(
        padding: const EdgeInsets.only(bottom: 12),
        child: Row(
          children: [
            Expanded(
              child: GestureDetector(
                onTap: () => setState(() => _selectedLeft = key),
                child: Container(
                  padding: const EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    color: _selectedLeft == key ? Colors.blue.shade100 : Colors.white,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: Colors.blue.shade50),
                  ),
                  child: Text(key, style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ),
            ),
            const Padding(padding: EdgeInsets.symmetric(horizontal: 10), child: Icon(Icons.link, color: Colors.blue)),
            Expanded(
              child: DragTarget<String>(
                builder: (context, candidates, rejected) => Container(
                  height: 50,
                  decoration: BoxDecoration(
                    color: _matchingPairs[key] == null ? Colors.grey.shade100 : Colors.green.shade50,
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: Center(child: Text(_matchingPairs[key] ?? 'Thả đáp án', style: TextStyle(color: _matchingPairs[key] == null ? Colors.grey : Colors.green, fontWeight: FontWeight.bold))),
                ),
                onAccept: (data) => setState(() => _matchingPairs[key] = data),
              ),
            ),
          ],
        ),
      )).toList(),
    );
  }

  void _showResult() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.workspace_premium, size: 100, color: Colors.amber),
            const SizedBox(height: 20),
            Text('KẾT QUẢ: $_score/${_questions.length}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 30),
            ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('HOÀN TẤT')),
          ],
        ),
      ),
    ).then((_) => Navigator.pop(context));
  }
}
