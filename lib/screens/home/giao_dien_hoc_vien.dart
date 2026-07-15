import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../dich_vu/dich_vu_bao_cao.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../thanh_phan/thanh_menu.dart';

class GiaoDienHocVien extends StatefulWidget {
  const GiaoDienHocVien({super.key});

  @override
  State<GiaoDienHocVien> createState() => _GiaoDienHocVienState();
}

class _GiaoDienHocVienState extends State<GiaoDienHocVien> {
  String userName = 'Học viên';
  Map<String, dynamic> _stats = {};
  List<dynamic> _myCourses = [];
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
      final stats = await ReportService.getStudentDashboard();
      final courses = await CourseService.getCourses();

      setState(() {
        userName = name ?? 'Học viên';
        _stats = stats;
        _myCourses = courses;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải dữ liệu HV: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Center(child: CircularProgressIndicator()));

    return Scaffold(
      drawer: const ThanhMenu(),
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: const Text('STUDENT APP', style: TextStyle(fontWeight: FontWeight.bold, letterSpacing: 1.2)),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.notifications_active_outlined), onPressed: () {}),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _loadAllData,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildGreeting(),
              const SizedBox(height: 25),
              _buildContinueLearning(),
              const SizedBox(height: 30),
              const Text('📊 Thống kê học tập', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildStatsGrid(),
              const SizedBox(height: 30),
              _buildSectionHeader('Khóa học của tôi', () {}),
              const SizedBox(height: 15),
              _buildCourseCarousel(),
              const SizedBox(height: 30),
              const Text('📢 Thông báo mới', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 15),
              _buildNotificationList(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildGreeting() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('👋 Xin chào,', style: TextStyle(color: Colors.grey.shade600, fontSize: 16)),
        const SizedBox(height: 4),
        Text(userName, style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Color(0xFF1A1C1E))),
      ],
    );
  }

  Widget _buildContinueLearning() {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(colors: [Color(0xFF4B8AF7), Color(0xFF0055D4)]),
        borderRadius: BorderRadius.circular(30),
        boxShadow: [BoxShadow(color: const Color(0xFF0055D4).withOpacity(0.3), blurRadius: 15, offset: const Offset(0, 8))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('🔥 TIẾP TỤC HỌC', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12, letterSpacing: 1.2)),
          const SizedBox(height: 10),
          const Text('Tiếng Anh Cơ Bản A1', style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
          const SizedBox(height: 15),
          Row(
            children: [
              const Expanded(child: ClipRRect(borderRadius: BorderRadius.all(Radius.circular(10)), child: LinearProgressIndicator(value: 0.8, backgroundColor: Colors.white24, valueColor: AlwaysStoppedAnimation(Colors.white)))),
              const SizedBox(width: 15),
              const Text('80%', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: () => Navigator.pushNamed(context, AppRoutes.exercise, arguments: {'id': 1, 'tieuDe': 'Bài học 1'}),
            icon: const Icon(Icons.play_arrow_rounded),
            label: const Text('TIẾP TỤC HÀNH TRÌNH'),
            style: ElevatedButton.styleFrom(backgroundColor: Colors.white, foregroundColor: const Color(0xFF0055D4), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
          )
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 15,
      crossAxisSpacing: 15,
      childAspectRatio: 1.5,
      children: [
        _statCard('Khóa học', _stats['totalCourses']?.toString() ?? '3', Icons.auto_stories, Colors.blue),
        _statCard('Bài kiểm tra', _stats['totalExams']?.toString() ?? '12', Icons.quiz, Colors.orange),
        _statBox('Điểm TB', _stats['avgScore']?.toString() ?? '8.7', Icons.workspace_premium, Colors.purple),
        _statBox('Tiến độ', '${(_stats['overallProgress'] ?? 80)}%', Icons.track_changes, Colors.green),
      ],
    );
  }

  Widget _statCard(String label, String val, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(15),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(25), border: Border.all(color: Colors.grey.shade100)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 22),
          const Spacer(),
          Text(val, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          Text(label, style: TextStyle(color: Colors.grey.shade500, fontSize: 11, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _statBox(String label, String val, IconData icon, Color color) {
    return _statCard(label, val, icon, color);
  }

  Widget _buildSectionHeader(String title, VoidCallback onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
        TextButton(onPressed: onTap, child: const Text('Xem tất cả')),
      ],
    );
  }

  Widget _buildCourseCarousel() {
    return SizedBox(
      height: 180,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: _myCourses.length,
        itemBuilder: (context, index) {
          final course = _myCourses[index];
          return Container(
            width: 260,
            margin: const EdgeInsets.only(right: 15),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(28), boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)]),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(course['tenKhoaHoc'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16), maxLines: 1),
                const SizedBox(height: 5),
                Text('Trình độ: ${course['trinhDo']}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                const Spacer(),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Tiến độ: 60%', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    TextButton(onPressed: () => Navigator.pushNamed(context, AppRoutes.courseDetail, arguments: course), child: const Text('HỌC TIẾP')),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildNotificationList() {
    final notices = [
      'Lớp A1 học tối nay 19:00',
      'Có bài kiểm tra mới được cập nhật',
      'Giáo viên đã chấm điểm bài làm của bạn'
    ];
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: notices.length,
      itemBuilder: (context, index) => Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
        child: Row(
          children: [
            const CircleAvatar(backgroundColor: Color(0xFFF0F4FF), child: Icon(Icons.notifications_active, color: Colors.blue, size: 20)),
            const SizedBox(width: 15),
            Expanded(child: Text(notices[index], style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500))),
          ],
        ),
      ),
    );
  }
}
