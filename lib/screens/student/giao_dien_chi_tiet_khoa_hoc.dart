import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../../dich_vu/dich_vu_phan_bai_hoc.dart';
import '../../duong_dan/duong_dan.dart';

class CourseDetailScreen extends StatefulWidget {
  final Map<String, dynamic> course;
  const CourseDetailScreen({super.key, required this.course});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  List<dynamic> _topics = [];
  Map<int, List<dynamic>> _lessonsByTopic = {};
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final courseId = widget.course['id'] ?? widget.course['khoaHocID'];
    if (courseId != null) {
      final topics = await CourseService.getLessons(int.parse(courseId.toString()));
      setState(() {
        _topics = topics;
      });
      
      for (var topic in topics) {
        final lessons = await PhanBaiHocService.getPhanBaiHoc(topic['id'] ?? topic['baiHocID']);
        setState(() {
          _lessonsByTopic[topic['id'] ?? topic['baiHocID']] = lessons;
        });
      }
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : CustomScrollView(
            slivers: [
              _buildHeader(),
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Row(
                    children: [
                      const Text('Lộ trình học tập', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                      const Spacer(),
                      Text('${_topics.length} Chủ đề', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
              ),
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => _buildTopicTile(_topics[index]),
                  childCount: _topics.length,
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
    );
  }

  Widget _buildHeader() {
    return SliverAppBar(
      expandedHeight: 200,
      pinned: true,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(colors: [Color(0xFF4B8AF7), Color(0xFF6A11CB)]),
          ),
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 40),
                Text(widget.course['tenKhoaHoc'] ?? '', 
                  textAlign: TextAlign.center,
                  style: const TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(10)),
                  child: Text(widget.course['trinhDo'] ?? 'A1', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTopicTile(dynamic topic) {
    final topicId = topic['id'] ?? topic['baiHocID'];
    final lessons = _lessonsByTopic[topicId] ?? [];
    
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
      ),
      child: ExpansionTile(
        tilePadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        shape: const Border(),
        leading: CircleAvatar(
          backgroundColor: Colors.blue.shade50,
          child: Text('${topic['thuTuHienThi'] ?? '1'}', style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold)),
        ),
        title: Text(topic['tenBaiHoc'] ?? '', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        subtitle: Text('${lessons.length} bài học con', style: const TextStyle(fontSize: 12)),
        children: lessons.map((l) => _buildLessonItem(l)).toList(),
      ),
    );
  }

  Widget _buildLessonItem(dynamic lesson) {
    IconData icon = Icons.play_circle_fill_rounded;
    Color color = Colors.blue;
    
    String loai = (lesson['loaiPhanBaiHoc'] ?? '').toString().toLowerCase();
    if (loai.contains('listen')) { icon = Icons.headset_rounded; color = Colors.purple; }
    if (loai.contains('speak')) { icon = Icons.mic_rounded; color = Colors.red; }
    if (loai.contains('read')) { icon = Icons.menu_book_rounded; color = Colors.orange; }
    if (loai.contains('write')) { icon = Icons.edit_note_rounded; color = Colors.green; }
    if (loai.contains('gram')) { icon = Icons.extension_rounded; color = Colors.teal; }

    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 30, vertical: 4),
      leading: Icon(icon, color: color),
      title: Text(lesson['tenPhanBaiHoc'] ?? '', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: Colors.grey),
      onTap: () => Navigator.pushNamed(context, AppRoutes.exercise, arguments: lesson),
    );
  }
}
