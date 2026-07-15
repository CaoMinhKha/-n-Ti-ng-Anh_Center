import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';
import '../../thanh_phan/thanh_menu.dart';

class GiaoDienGiaoVien extends StatefulWidget {
  const GiaoDienGiaoVien({super.key});

  @override
  State<GiaoDienGiaoVien> createState() => _GiaoDienGiaoVienState();
}

class _GiaoDienGiaoVienState extends State<GiaoDienGiaoVien> {
  String userName = 'Giáo viên';
  Map<String, dynamic> _stats = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadAllData();
  }

  Future<void> _loadAllData() async {
    setState(() => _isLoading = true);
    try {
      final name = await UserSession.getUserName();
      final stats = await ReportService.getTeacherDashboard();

      setState(() {
        userName = name ?? 'Giáo viên';
        _stats = stats;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải Dashboard GV: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      drawer: const ThanhMenu(),
      backgroundColor: const Color(0xFFF4F1FF),
      appBar: AppBar(
        title: const Text('DASHBOARD GIÁO VIÊN', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.refresh_rounded), onPressed: _loadAllData),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(25),
                boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)],
              ),
              child: Row(
                children: [
                  const CircleAvatar(radius: 30, backgroundColor: Color(0xFF6200EE), child: Icon(Icons.person, color: Colors.white, size: 30)),
                  const SizedBox(width: 15),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Xin chào,', style: TextStyle(color: Colors.grey, fontSize: 14)),
                      Text(userName, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 25),
            _buildStatsGrid(),
            const SizedBox(height: 30),
            const Text('Chức năng giảng dạy', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 15),
            _buildQuickActions(),
          ],
        ),
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 3,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      childAspectRatio: 0.85,
      children: [
        _statBox('Lớp dạy', _stats['totalClasses']?.toString() ?? '6', Icons.class_rounded, Colors.blue),
        _statBox('Học viên', _stats['totalStudents']?.toString() ?? '156', Icons.group_rounded, Colors.orange),
        _statBox('Buổi học', _stats['totalSessions']?.toString() ?? '24', Icons.calendar_today_rounded, Colors.green),
        _statBox('Bài kiểm tra', _stats['totalExams']?.toString() ?? '18', Icons.assignment_rounded, Colors.purple),
        _statBox('Tiến độ', '82%', Icons.trending_up_rounded, Colors.teal),
        _statBox('Đánh giá', '4.8★', Icons.star_rounded, Colors.amber),
      ],
    );
  }

  Widget _statBox(String label, String val, IconData icon, Color color) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 8),
          Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          Text(label, textAlign: TextAlign.center, style: TextStyle(color: Colors.grey.shade600, fontSize: 10, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Wrap(
      spacing: 15,
      runSpacing: 15,
      children: [
        _actionCard('Lớp học của tôi', Icons.class_outlined, Colors.blue, () => Navigator.pushNamed(context, AppRoutes.teacherHome)),
        _actionCard('Lịch dạy', Icons.calendar_month_outlined, Colors.green, () {}),
        _actionCard('Quản lý bài học', Icons.book_outlined, Colors.orange, () {}),
        _actionCard('Bài kiểm tra', Icons.assignment_outlined, Colors.purple, () {}),
        _actionCard('Danh sách học viên', Icons.groups_outlined, Colors.teal, () {}),
        _actionCard('Thông báo', Icons.notifications_none_outlined, Colors.red, () {}),
      ],
    );
  }

  Widget _actionCard(String label, IconData icon, Color color, [VoidCallback? onTap]) {
    return InkWell(
      onTap: onTap,
      child: Container(
        width: (MediaQuery.of(context).size.width - 55) / 2,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(25),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: color.withOpacity(0.1), shape: BoxShape.circle),
              child: Icon(icon, color: color, size: 26),
            ),
            const SizedBox(height: 12),
            Text(label, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
          ],
        ),
      ),
    );
  }
}
