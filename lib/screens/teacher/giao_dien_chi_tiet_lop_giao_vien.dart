import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../dich_vu/dich_vu_phan_bai_hoc.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';
import '../../dich_vu/dich_vu_lich_hoc.dart';
import '../../dich_vu/dich_vu_bai_kiem_tra.dart';
import 'giao_dien_danh_sach_hoc_vien_giao_vien.dart';

class TeacherClassDetailScreen extends StatefulWidget {
  final int classId;
  final String className;
  final int courseId;

  const TeacherClassDetailScreen({
    super.key, 
    required this.classId, 
    required this.className, 
    required this.courseId
  });

  @override
  State<TeacherClassDetailScreen> createState() => _TeacherClassDetailScreenState();
}

class _TeacherClassDetailScreenState extends State<TeacherClassDetailScreen> {
  bool _isLoading = true;
  List<dynamic> _topics = [];
  Map<int, List<dynamic>> _lessonsByTopic = {};
  List<dynamic> _schedules = [];
  List<dynamic> _exams = [];

  @override
  void initState() {
    super.initState();
    _loadClassData();
  }

  Future<void> _loadClassData() async {
    setState(() => _isLoading = true);
    try {
      // 1. Lấy dữ liệu bài học
      final topics = await CourseService.getLessons(widget.courseId);
      _topics = topics;
      for (var topic in topics) {
        final id = topic['id'] ?? topic['baiHocID'];
        final lessons = await PhanBaiHocService.getPhanBaiHoc(id);
        _lessonsByTopic[id] = lessons;
      }

      // 2. Lấy lịch học của lớp (Module 7)
      _schedules = await ScheduleService.getScheduleByClass(widget.classId);

      // 3. Lấy bài kiểm tra của lớp (Module 11)
      _exams = await ExamService.getExams(); // Cần filter theo classId nếu backend hỗ trợ

      setState(() => _isLoading = false);
    } catch (e) {
      debugPrint('Lỗi tải chi tiết lớp: $e');
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: Text(widget.className, style: const TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : DefaultTabController(
            length: 4,
            child: Column(
              children: [
                _buildHeaderStats(),
                const TabBar(
                  isScrollable: true,
                  labelColor: Color(0xFF2563EB),
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: Color(0xFF2563EB),
                  tabs: [
                    Tab(text: 'BÀI HỌC'),
                    Tab(text: 'HỌC VIÊN'),
                    Tab(text: 'LỊCH HỌC'),
                    Tab(text: 'KIỂM TRA'),
                  ],
                ),
                Expanded(
                  child: TabBarView(
                    children: [
                      _buildLessonsTab(),
                      TeacherStudentListScreen(classId: widget.classId, className: widget.className),
                      _buildTimetableTab(),
                      _buildExamsTab(),
                    ],
                  ),
                ),
              ],
            ),
          ),
    );
  }

  Widget _buildHeaderStats() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _miniStat('Sĩ số', '25/30', Colors.blue),
          _miniStat('Hoàn thành', '60%', Colors.green),
          _miniStat('Buổi học', '12/24', Colors.orange),
        ],
      ),
    );
  }

  Widget _miniStat(String l, String v, Color c) {
    return Column(
      children: [
        Text(v, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: c)),
        Text(l, style: const TextStyle(color: Colors.grey, fontSize: 11)),
      ],
    );
  }

  Widget _buildLessonsTab() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _topics.length,
      itemBuilder: (context, index) {
        final topic = _topics[index];
        final id = topic['id'] ?? topic['baiHocID'];
        final lessons = _lessonsByTopic[id] ?? [];

        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ExpansionTile(
            leading: CircleAvatar(backgroundColor: Colors.blue.shade50, child: Text('${index + 1}')),
            title: Text(topic['tenBaiHoc'] ?? 'Chủ đề', style: const TextStyle(fontWeight: FontWeight.bold)),
            children: lessons.map((l) => ListTile(
              leading: const Icon(Icons.play_circle_outline, color: Colors.blue),
              title: Text(l['tenPhanBaiHoc'] ?? ''),
              trailing: const Icon(Icons.chevron_right, size: 16),
            )).toList(),
          ),
        );
      },
    );
  }

  Widget _buildTimetableTab() {
    if (_schedules.isEmpty) return const Center(child: Text('Chưa cập nhật lịch học.'));
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _schedules.length,
      itemBuilder: (context, index) {
        final s = _schedules[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const Icon(Icons.calendar_today, color: Colors.orange),
            title: Text(s['ten_thu'] ?? 'Thứ'),
            subtitle: Text('${s['ca_hoc']} (${s['gio_bat_dau']} - ${s['gio_ket_thuc']})'),
            trailing: Text(s['phong_hoc'] ?? 'Phòng học', style: const TextStyle(fontWeight: FontWeight.bold)),
          ),
        );
      },
    );
  }

  Widget _buildExamsTab() {
    if (_exams.isEmpty) return const Center(child: Text('Chưa có bài kiểm tra nào.'));
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _exams.length,
      itemBuilder: (context, index) {
        final e = _exams[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const Icon(Icons.quiz, color: Colors.purple),
            title: Text(e['TenBaiKiemTra'] ?? 'Bài kiểm tra'),
            subtitle: Text('Thời gian: ${e['ThoiGianLamBai']} phút • ${e['DiemMax']} điểm'),
            trailing: const Icon(Icons.analytics_outlined),
          ),
        );
      },
    );
  }
}
