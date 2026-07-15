import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';
import '../../tien_ich/api_client.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  List<dynamic> _history = [];
  bool _isLoading = true;
  final _otpController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    final data = await ReportService.getStudentAttendance();
    setState(() {
      _history = data;
      _isLoading = false;
    });
  }

  Future<void> _submitOtp() async {
    if (_otpController.text.isEmpty) return;
    
    // Gọi API Module 8: POST /api/diemdanh/madiemdanh/verify
    final res = await ApiClient.postJson('/diemdanh/madiemdanh/verify', {
      'code': _otpController.text.trim()
    });

    if (!mounted) return;
    if (res['status'] == true) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Điểm danh thành công!'), backgroundColor: Colors.green));
      _otpController.clear();
      _loadHistory();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Mã không đúng'), backgroundColor: Colors.red));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(title: const Text('ĐIỂM DANH & CHUYÊN CẦN'), centerTitle: true),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _buildOtpInputCard(),
            const SizedBox(height: 30),
            const Row(children: [Text('Lịch sử chuyên cần', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold))]),
            const SizedBox(height: 15),
            _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _buildHistoryList(),
          ],
        ),
      ),
    );
  }

  Widget _buildOtpInputCard() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF6A11CB), Color(0xFF2575FC)]),
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        children: [
          const Icon(Icons.qr_code_scanner, color: Colors.white, size: 50),
          const SizedBox(height: 15),
          const Text('NHẬP MÃ ĐIỂM DANH', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          const Text('Nhận mã từ giáo viên tại lớp học', style: TextStyle(color: Colors.white70, fontSize: 12)),
          const SizedBox(height: 25),
          TextField(
            controller: _otpController,
            textAlign: TextAlign.center,
            maxLength: 6,
            style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold, letterSpacing: 8),
            decoration: InputDecoration(
              counterText: '',
              filled: true,
              fillColor: Colors.white.withOpacity(0.15),
              hintText: '000000',
              hintStyle: const TextStyle(color: Colors.white30),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submitOtp,
            style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: Colors.blue, minimumSize: const Size(double.infinity, 55)),
            child: const Text('XÁC NHẬN ĐIỂM DANH', style: TextStyle(fontWeight: FontWeight.bold)),
          )
        ],
      ),
    );
  }

  Widget _buildHistoryList() {
    if (_history.isEmpty) return const Text('Chưa có lịch sử điểm danh.');
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _history.length,
      itemBuilder: (context, index) {
        final item = _history[index];
        bool isPresent = item['trangThai'] == 'CO_MAT';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: isPresent ? Colors.green.shade50 : Colors.red.shade50,
              child: Icon(isPresent ? Icons.check : Icons.close, color: isPresent ? Colors.green : Colors.red, size: 18),
            ),
            title: Text(item['tenLop'] ?? 'Lớp học', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(item['ngayHoc'] ?? ''),
            trailing: Text(isPresent ? 'Có mặt' : 'Vắng', style: TextStyle(color: isPresent ? Colors.green : Colors.red, fontWeight: FontWeight.bold)),
          ),
        );
      },
    );
  }
}
