import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_bai_hoc.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../mo_hinh/khoa_hoc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class StudyScreen extends StatefulWidget {
  const StudyScreen({super.key});

  @override
  State<StudyScreen> createState() => _StudyScreenState();
}

class _StudyScreenState extends State<StudyScreen> {
  List<dynamic> _lessons = [];
  List<Course> _myCourses = [];
  bool _isLoading = true;
  String _userName = 'Học viên';

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final name = await UserSession.getUserName();
      final courses = await CourseService.getCourses();
      
      // Lấy bài học của khóa học đầu tiên để hiển thị
      List<dynamic> lessons = [];
      if (courses.isNotEmpty) {
        lessons = await LessonService.getLessonsByCourse(courses[0].maKhoaHoc);
      }

      setState(() {
        _userName = name ?? 'Học viên';
        _myCourses = courses;
        _lessons = lessons;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Lỗi tải bài học: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : CustomScrollView(
              slivers: [
                _buildSliverAppBar(),
                SliverToBoxAdapter(child: _buildHeaderContent()),
                SliverPadding(
                  padding: const EdgeInsets.all(16),
                  sliver: SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (context, index) => _buildLessonCard(_lessons[index], index),
                      childCount: _lessons.length,
                    ),
                  ),
                ),
              ],
            ),
    );
  }

  Widget _buildSliverAppBar() {
    return SliverAppBar(
      expandedHeight: 120,
      floating: false,
      pinned: true,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        title: Text('Học tập', style: TextStyle(color: Colors.blue.shade900, fontWeight: FontWeight.bold)),
        background: Container(color: const Color(0xFFF0F4FF)),
      ),
      backgroundColor: const Color(0xFFF0F4FF),
    );
  }

  Widget _buildHeaderContent() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF6A11CB), Color(0xFF2575FC)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(30),
              boxShadow: [
                BoxShadow(color: Colors.blue.withOpacity(0.3), blurRadius: 20, offset: const Offset(0, 10)),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Xin chào, $_userName', style: const TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                const Text('Bạn đã sẵn sàng để chinh phục tiếng Anh hôm nay chưa?', style: TextStyle(color: Colors.white70, fontSize: 14)),
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    _buildQuickStat('Bài học', _lessons.length.toString()),
                    _buildQuickStat('Khóa học', _myCourses.length.toString()),
                    _buildQuickStat('Streak', '3 ngày'),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 30),
          const Text('Lộ trình bài học', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 8),
          Text(_myCourses.isNotEmpty ? _myCourses[0].tenKhoaHoc : 'Khóa học của tôi', style: TextStyle(color: Colors.grey.shade600)),
        ],
      ),
    );
  }

  Widget _buildQuickStat(String label, String value) {
    return Column(
      children: [
        Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
        Text(label, style: const TextStyle(color: Colors.white60, fontSize: 12)),
      ],
    );
  }

  Widget _buildLessonCard(dynamic lesson, int index) {
    bool isDone = (double.tryParse(lesson['PhanTramHoanThanh']?.toString() ?? '0') ?? 0) >= 100;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: isDone ? Colors.green.shade50 : Colors.blue.shade50,
            borderRadius: BorderRadius.circular(15),
          ),
          child: Center(
            child: Icon(
              isDone ? Icons.check_circle : Icons.play_circle_filled,
              color: isDone ? Colors.green : Colors.blue,
              size: 28,
            ),
          ),
        ),
        title: Text(lesson['TieuDe'] ?? 'Bài học ${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 8),
          child: LinearProgressIndicator(
            value: (double.tryParse(lesson['PhanTramHoanThanh']?.toString() ?? '0') ?? 0) / 100,
            backgroundColor: Colors.grey.shade100,
            valueColor: AlwaysStoppedAnimation(isDone ? Colors.green : Colors.blue),
            minHeight: 6,
            borderRadius: BorderRadius.circular(3),
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
        onTap: () {
          // Điều hướng đến chi tiết bài học (Ví dụ màn hình kéo thả bạn đã có)
          Navigator.pushNamed(context, '/student/lesson-drag-match');
        },
      ),
    );
  }
}
