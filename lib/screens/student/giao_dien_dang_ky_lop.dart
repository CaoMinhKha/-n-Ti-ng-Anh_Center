import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../tien_ich/api_client.dart';

class RegisterClassScreen extends StatefulWidget {
  final int? courseId;
  final String? courseName;

  const RegisterClassScreen({super.key, this.courseId, this.courseName});

  @override
  State<RegisterClassScreen> createState() => _RegisterClassScreenState();
}

class _RegisterClassScreenState extends State<RegisterClassScreen> {
  List<Map<String, dynamic>> _availableClasses = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadClasses();
  }

  Future<void> _loadClasses() async {
    setState(() => _isLoading = true);
    try {
      // Lấy toàn bộ lớp học (Module 6)
      final allClasses = await AppDataService.loadClasses();
      setState(() {
        // Lọc lớp theo khóa học nếu có
        if (widget.courseId != null) {
          _availableClasses = allClasses.where((c) => c['khoaHocID'] == widget.courseId).toList();
        } else {
          _availableClasses = allClasses;
        }
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải lớp: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleEnroll(int lopHocId, double hocPhi) async {
    final studentId = await UserSession.getUserId();
    if (studentId == null) return;

    final res = await ApiClient.postJson('/lophoc/$lopHocId/dangky', {
      'HocVienID': studentId,
      'HocPhi': hocPhi,
    });

    if (!mounted) return;
    if (res['status'] == true) {
      _showSuccessDialog();
    } else {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(res['message'] ?? 'Đăng ký thất bại')));
    }
  }

  void _showSuccessDialog() {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Icon(Icons.check_circle, color: Colors.green, size: 60),
        content: const Text('Đăng ký thành công! Hãy hoàn thành học phí để bắt đầu học.', textAlign: TextAlign.center),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('ĐÓNG')),
          ElevatedButton(onPressed: () => Navigator.pop(context), child: const Text('THANH TOÁN NGAY')),
        ],
      ),
    ).then((_) => Navigator.pop(context));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: Text(widget.courseName ?? 'Đăng ký lớp học'),
        elevation: 0,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : _availableClasses.isEmpty 
          ? const Center(child: Text('Hiện chưa có lớp nào đang mở cho khóa học này.'))
          : ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _availableClasses.length,
              itemBuilder: (context, index) => _buildClassCard(_availableClasses[index]),
            ),
    );
  }

  Widget _buildClassCard(Map<String, dynamic> item) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(child: Text(item['tenLopHoc'] ?? '', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold))),
                const Icon(Icons.star, color: Colors.amber, size: 18),
                const Text(' 4.9', style: TextStyle(fontWeight: FontWeight.bold)),
              ],
            ),
            const SizedBox(height: 15),
            _infoRow(Icons.person, 'Giáo viên', item['hoVaTenGV'] ?? 'Đang cập nhật'),
            _infoRow(Icons.groups, 'Sĩ số', '20/30 (Còn trống 10)'),
            _infoRow(Icons.calendar_today, 'Khai giảng', item['ngayBatDau']?.toString().substring(0, 10) ?? ''),
            const Divider(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Học phí', style: TextStyle(color: Colors.grey, fontSize: 12)),
                    Text('${item['hocPhi'] ?? 0}đ', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ],
                ),
                ElevatedButton(
                  onPressed: () => _handleEnroll(item['id'], double.parse(item['hocPhi'].toString())),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF2563EB),
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  child: const Text('ĐĂNG KÝ', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                )
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(IconData icon, String label, String val) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey),
          const SizedBox(width: 8),
          Text('$label: ', style: const TextStyle(color: Colors.grey, fontSize: 13)),
          Text(val, style: const TextStyle(fontWeight: FontWeight.w500, fontSize: 13)),
        ],
      ),
    );
  }
}
