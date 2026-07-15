import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../thanh_phan/thanh_menu.dart';

class TeacherDashboardScreen extends StatefulWidget {
  const TeacherDashboardScreen({super.key});

  @override
  State<TeacherDashboardScreen> createState() => _TeacherDashboardScreenState();
}

class _TeacherDashboardScreenState extends State<TeacherDashboardScreen> {
  bool _isLoading = true;
  Map<String, dynamic> _stats = {};
  String userName = 'Giáo viên';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final name = await UserSession.getUserName();
      final data = await ReportService.getTeacherDashboard();
      setState(() {
        userName = name ?? 'Giáo viên';
        _stats = data;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi Dashboard GV: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      drawer: const ThanhMenu(),
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: const Text('GIÁO VIÊN'),
        centerTitle: true,
        elevation: 0,
        backgroundColor: const Color(0xFF2563EB),
        foregroundColor: Colors.white,
      ),
      body: RefreshIndicator(
        onRefresh: _loadData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Xin chào: $userName', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF1E293B))),
              const SizedBox(height: 20),
              
              // Hàng 1: Lớp dạy, Học viên, Buổi học
              Row(
                children: [
                  _buildStatCard('Lớp dạy', _stats['totalClasses']?.toString() ?? '6', Icons.book, const Color(0xFF2563EB)),
                  const SizedBox(width: 12),
                  _buildStatCard('Học viên', _stats['totalStudents']?.toString() ?? '156', Icons.group, const Color(0xFF10B981)),
                  const SizedBox(width: 12),
                  _buildStatCard('Buổi học', _stats['totalSessions']?.toString() ?? '24', Icons.calendar_today, const Color(0xFFF59E0B)),
                ],
              ),
              const SizedBox(height: 12),
              
              // Hàng 2: Bài kiểm tra, Tiến độ, Đánh giá
              Row(
                children: [
                  _buildStatCard('Bài kiểm tra', _stats['totalExams']?.toString() ?? '18', Icons.assignment, const Color(0xFFEC4899)),
                  const SizedBox(width: 12),
                  _buildStatCard('Tiến độ', '82%', Icons.trending_up, const Color(0xFF06B6D4)),
                  const SizedBox(width: 12),
                  _buildStatCard('Đánh giá', '4.8★', Icons.star, const Color(0xFFF59E0B)),
                ],
              ),
              
              const SizedBox(height: 30),
              const Text('Lịch dạy hôm nay', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildTodaySchedule(),
              
              const SizedBox(height: 30),
              const Text('Thông báo mới', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildNotifications(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: color.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))],
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 10),
            Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 4),
            Text(title, textAlign: TextAlign.center, style: const TextStyle(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold)),
          ],
        ),
      ),
    );
  }

  Widget _buildTodaySchedule() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          _scheduleItem('08:00 - A1 Morning', 'Phòng 101'),
          const Divider(height: 1),
          _scheduleItem('13:30 - A2 Evening', 'Phòng 202'),
        ],
      ),
    );
  }

  Widget _scheduleItem(String time, String room) {
    return ListTile(
      leading: const CircleAvatar(backgroundColor: Color(0xFFEFF6FF), child: Icon(Icons.access_time, color: Color(0xFF2563EB), size: 20)),
      title: Text(time, style: const TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(room),
      trailing: const Icon(Icons.chevron_right, size: 16),
    );
  }

  Widget _buildNotifications() {
    return Column(
      children: [
        _notifItem('Lớp A1 nghỉ học ngày mai', '1 giờ trước'),
        _notifItem('Đã cập nhật bài học Unit 5', '3 giờ trước'),
      ],
    );
  }

  Widget _notifItem(String msg, String time) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(15)),
      child: Row(
        children: [
          const Icon(Icons.info_outline, color: Color(0xFFF59E0B)),
          const SizedBox(width: 15),
          Expanded(child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(msg, style: const TextStyle(fontWeight: FontWeight.w500)),
              Text(time, style: const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          )),
        ],
      ),
    );
  }
}
