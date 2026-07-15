import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class LearningProgressScreen extends StatefulWidget {
  const LearningProgressScreen({super.key});

  @override
  State<LearningProgressScreen> createState() => _LearningProgressScreenState();
}

class _LearningProgressScreenState extends State<LearningProgressScreen> {
  bool _isLoading = true;
  Map<String, dynamic> _progressData = {};
  List<dynamic> _examResults = [];

  @override
  void initState() {
    super.initState();
    _loadProgress();
  }

  Future<void> _loadProgress() async {
    setState(() => _isLoading = true);
    try {
      final stats = await ReportService.getStudentDashboard();
      final results = await ReportService.getStudentResults();
      setState(() {
        _progressData = stats;
        _examResults = results;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải tiến độ: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: const Text('TIẾN ĐỘ HỌC TẬP', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: RefreshIndicator(
        onRefresh: _loadProgress,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildOverallProgressCard(),
              const SizedBox(height: 30),
              const Text('Phân tích kỹ năng', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildSkillStats(),
              const SizedBox(height: 30),
              const Text('Lịch sử bài kiểm tra', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildExamHistory(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildOverallProgressCard() {
    double percent = (_progressData['overallProgress'] ?? 0) / 100.0;
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF6A11CB), Color(0xFF2575FC)]),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        children: [
          const Text('TIẾN ĐỘ TỔNG QUAN', style: TextStyle(color: Colors.white70, fontWeight: FontWeight.bold, fontSize: 12)),
          const SizedBox(height: 20),
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 120, height: 120,
                child: CircularProgressIndicator(
                  value: percent,
                  strokeWidth: 12,
                  backgroundColor: Colors.white12,
                  valueColor: const AlwaysStoppedAnimation(Colors.white),
                ),
              ),
              Text('${(percent * 100).toInt()}%', style: const TextStyle(color: Colors.white, fontSize: 28, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _miniStat('Hoàn thành', '${_progressData['completedLessons'] ?? 0} bài'),
              _miniStat('Điểm TB', '${_progressData['avgScore'] ?? 0.0}'),
            ],
          )
        ],
      ),
    );
  }

  Widget _miniStat(String label, String val) {
    return Column(
      children: [
        Text(val, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
        Text(label, style: const TextStyle(color: Colors.white60, fontSize: 11)),
      ],
    );
  }

  Widget _buildSkillStats() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(24)),
      child: Column(
        children: [
          _skillBar('Listening', 0.8, Colors.purple),
          _skillBar('Speaking', 0.6, Colors.red),
          _skillBar('Reading', 0.9, Colors.orange),
          _skillBar('Writing', 0.5, Colors.green),
        ],
      ),
    );
  }

  Widget _skillBar(String label, double val, Color color) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              Text('${(val * 100).toInt()}%', style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 13)),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(10),
            child: LinearProgressIndicator(value: val, backgroundColor: color.withOpacity(0.1), valueColor: AlwaysStoppedAnimation(color), minHeight: 8),
          ),
        ],
      ),
    );
  }

  Widget _buildExamHistory() {
    if (_examResults.isEmpty) return const Center(child: Text('Chưa có dữ liệu bài kiểm tra.'));
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _examResults.length,
      itemBuilder: (context, index) {
        final item = _examResults[index];
        double score = double.tryParse(item['diem'].toString()) ?? 0.0;
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20), border: Border.all(color: Colors.grey.shade100)),
          child: Row(
            children: [
              CircleAvatar(
                backgroundColor: score >= 5 ? Colors.green.shade50 : Colors.red.shade50,
                child: Text(score.toStringAsFixed(1), style: TextStyle(color: score >= 5 ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 14)),
              ),
              const SizedBox(width: 15),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['tenBaiKiemTra'] ?? 'Bài kiểm tra', style: const TextStyle(fontWeight: FontWeight.bold)),
                    Text('Ngày làm: ${item['ngayNop']?.toString().substring(0, 10) ?? ''}', style: const TextStyle(color: Colors.grey, fontSize: 11)),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: Colors.grey),
            ],
          ),
        );
      },
    );
  }
}
