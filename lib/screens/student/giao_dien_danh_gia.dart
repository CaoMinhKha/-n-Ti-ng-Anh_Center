import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_danh_gia.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class StudentEvaluationScreen extends StatefulWidget {
  const StudentEvaluationScreen({super.key});

  @override
  State<StudentEvaluationScreen> createState() => _StudentEvaluationScreenState();
}

class _StudentEvaluationScreenState extends State<StudentEvaluationScreen> {
  List<dynamic> _evaluations = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadEvaluations();
  }

  Future<void> _loadEvaluations() async {
    final studentId = await UserSession.getMaHocVien();
    if (studentId != null) {
      final data = await EvaluationService.getStudentEvaluations(studentId);
      setState(() {
        _evaluations = data;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FF),
      appBar: AppBar(
        title: const Text('Nhận xét từ Giáo viên'),
        centerTitle: true,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _evaluations.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: _evaluations.length,
                  itemBuilder: (context, index) => _buildEvaluationCard(_evaluations[index]),
                ),
    );
  }

  Widget _buildEvaluationCard(dynamic eval) {
    double score = double.tryParse(eval['DiemDanhGia'].toString()) ?? 0.0;
    
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const CircleAvatar(
                backgroundColor: Color(0xFF4B8AF7),
                child: Icon(Icons.psychology, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Giáo viên đánh giá', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    Text(eval['HoTenGiaoVien'] ?? 'Giáo viên', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(color: Colors.amber.shade50, borderRadius: BorderRadius.circular(10)),
                child: Row(
                  children: [
                    const Icon(Icons.star, color: Colors.amber, size: 16),
                    const SizedBox(width: 4),
                    Text(score.toStringAsFixed(1), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.amber)),
                  ],
                ),
              ),
            ],
          ),
          const Divider(height: 30),
          const Text('NHẬN XÉT:', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.2)),
          const SizedBox(height: 8),
          Text(
            eval['NhanXet'] ?? 'Chưa có nhận xét cụ thể.',
            style: const TextStyle(fontSize: 15, height: 1.5, fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 16),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              'Ngày: ${eval['NgayDanhGia'] ?? ''}',
              style: const TextStyle(color: Colors.grey, fontSize: 12),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.rate_review_outlined, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('Bạn chưa có đánh giá nào', style: TextStyle(color: Colors.grey, fontSize: 16)),
        ],
      ),
    );
  }
}
