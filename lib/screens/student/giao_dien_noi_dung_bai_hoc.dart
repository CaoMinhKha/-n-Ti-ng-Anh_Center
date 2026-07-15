import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import 'package:video_player/video_player.dart';

class LessonContentScreen extends StatefulWidget {
  final Map<String, dynamic> lesson;
  const LessonContentScreen({super.key, required this.lesson});

  @override
  State<LessonContentScreen> createState() => _LessonContentScreenState();
}

class _LessonContentScreenState extends State<LessonContentScreen> {
  VideoPlayerController? _videoController;
  bool _isInfoExpanded = false;

  @override
  void initState() {
    super.initState();
    if (widget.lesson['videoUrl'] != null && widget.lesson['videoUrl'].isNotEmpty) {
      _videoController = VideoPlayerController.networkUrl(Uri.parse(widget.lesson['videoUrl']))
        ..initialize().then((_) => setState(() {}));
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final l = widget.lesson;
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(title: Text(l['tenPhanBaiHoc'] ?? 'Nội dung bài học'), elevation: 0),
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildVideoPlayer(),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(l['tieuDe'] ?? 'Tiêu đề bài học', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  _buildTags(l['loaiPhanBaiHoc'] ?? 'General'),
                  const SizedBox(height: 20),
                  _buildResourceSection(),
                  const SizedBox(height: 30),
                  const Text('Mô tả chi tiết', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 10),
                  Text(l['noiDungText'] ?? 'Nội dung bài học đang được cập nhật...', style: const TextStyle(color: Colors.black87, height: 1.6)),
                ],
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomAction(),
    );
  }

  Widget _buildVideoPlayer() {
    if (_videoController == null) {
      return Container(
        height: 220, width: double.infinity, color: Colors.black,
        child: const Column(mainAxisAlignment: MainAxisAlignment.center, children: [Icon(Icons.play_circle_outline, color: Colors.white, size: 50), Text('Không có video bài giảng', style: TextStyle(color: Colors.white))]),
      );
    }
    return AspectRatio(
      aspectRatio: _videoController!.value.aspectRatio,
      child: Stack(
        alignment: Alignment.bottomCenter,
        children: [
          VideoPlayer(_videoController!),
          VideoProgressIndicator(_videoController!, allowScrubbing: true),
          Center(child: IconButton(icon: Icon(_videoController!.value.isPlaying ? Icons.pause : Icons.play_arrow, color: Colors.white, size: 50), onPressed: () => setState(() => _videoController!.value.isPlaying ? _videoController!.pause() : _videoController!.play()))),
        ],
      ),
    );
  }

  Widget _buildTags(String type) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(10)),
      child: Text(type.toUpperCase(), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 10)),
    );
  }

  Widget _buildResourceSection() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: const Color(0xFFF8F9FE), borderRadius: BorderRadius.circular(20)),
      child: Column(
        children: [
          _resourceItem(Icons.picture_as_pdf, 'Tài liệu bài giảng.pdf', '2.4 MB'),
          const Divider(height: 20),
          _resourceItem(Icons.headset, 'Audio luyện nghe.mp3', '5.1 MB'),
        ],
      ),
    );
  }

  Widget _resourceItem(IconData icon, String name, String size) {
    return Row(
      children: [
        Icon(icon, color: Colors.redAccent),
        const SizedBox(width: 15),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [Text(name, style: const TextStyle(fontWeight: FontWeight.bold)), Text(size, style: const TextStyle(color: Colors.grey, fontSize: 11))])),
        IconButton(icon: const Icon(Icons.download_rounded, color: Colors.blue), onPressed: () {}),
      ],
    );
  }

  Widget _buildBottomAction() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, -5))]),
      child: ElevatedButton(
        onPressed: () => Navigator.pushNamed(context, AppRoutes.exercise, arguments: widget.lesson),
        style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
        child: const Text('BẮT ĐẦU LÀM BÀI TẬP', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
      ),
    );
  }
}
