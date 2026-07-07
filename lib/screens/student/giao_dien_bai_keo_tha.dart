import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../../dich_vu/dich_vu_bai_hoc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class LessonDragMatchScreen extends StatefulWidget {
  const LessonDragMatchScreen({super.key});

  @override
  State<LessonDragMatchScreen> createState() => _LessonDragMatchScreenState();
}

class _LessonDragMatchScreenState extends State<LessonDragMatchScreen> {
  bool _isLoadingRole = true;
  bool _isVideoLoading = false;
  String? _videoError;
  VideoPlayerController? _videoController;
  List<Map<String, dynamic>> _remoteLessons = [];

  final List<String> _lessonTitles = [
    'Lesson 1A.0: Introduction',
    'Lesson 1A.1: Reading',
    'Lesson 1A.2: Post - Reading',
    'Lesson 1A.3: Listening A',
    'Lesson 1A.4: Listening B',
    'Lesson 1A.5: Speaking',
    'Lesson 1A.6: Language Focus B',
    'Lesson 1A.7: Language Focus A',
    'Lesson 1B.1: Vocabulary',
    'Lesson 1B.2: Listening a',
    'Lesson 1B.3: Language Focus',
    'Lesson 1B.4: Reading',
    'Lesson 1B.5: Listening b',
    'Lesson 1B.6: Speaking',
  ];

  int _selectedLessonIndex = 11;

  @override
  void initState() {
    super.initState();
    _loadUserRole();
    _loadLessonVideos();
  }

  Future<void> _loadLessonVideos() async {
    final lessons = await LessonService.getLessons(slug: 'video', includeFull: true);
    if (!mounted) return;
    _remoteLessons = lessons.whereType<Map<String, dynamic>>().toList();
    if (_remoteLessons.isNotEmpty) {
      _setVideoForLesson(_lessonTitles[_selectedLessonIndex]);
    }
  }

  Future<void> _setVideoForLesson(String lessonTitle) async {
    if (!mounted) return;

    final selectedLesson = _remoteLessons.firstWhere(
      (item) => item['TieuDe']?.toString() == lessonTitle,
      orElse: () => _remoteLessons.first,
    );

    final rawVideoUrl = selectedLesson['VideoUrl']?.toString();
    final videoUrl = (rawVideoUrl != null && rawVideoUrl.isNotEmpty && !rawVideoUrl.toLowerCase().endsWith('.html'))
        ? rawVideoUrl
        : 'https://flutter.github.io/assets-for-api-docs/assets/videos/bee.mp4';

    if (videoUrl.isEmpty) {
      _videoController?.dispose();
      setState(() {
        _videoController = null;
        _videoError = 'Không có URL video phù hợp';
      });
      return;
    }

    _videoController?.dispose();
    setState(() {
      _isVideoLoading = true;
      _videoError = null;
      _videoController = null;
    });

    try {
      final controller = VideoPlayerController.network(videoUrl);
      await controller.initialize();
      controller.setLooping(false);
      setState(() {
        _videoController = controller;
        _isVideoLoading = false;
      });
    } catch (e) {
      setState(() {
        _videoError = 'Lỗi tải video: $e';
        _isVideoLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    super.dispose();
  }

  Future<void> _loadUserRole() async {
    final role = await UserSession.getUserRole();
    if (!mounted) return;
    if (role != 'student') {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Chỉ học viên mới được truy cập bài học này.')),
        );
        Navigator.pop(context);
      });
      return;
    }
    setState(() {
      _isLoadingRole = false;
    });
  }

  final List<String> _answers = [
    'was having', 
    'took',
    'was watching',
    'hit',
    'were trying',
    'was reading',
    'was sitting',
    'witnessed',
  ];

  final List<String?> _selectedAnswers = List<String?>.filled(8, null);
  bool _submitted = false;

  List<String> get _availableAnswers {
    final selected = _selectedAnswers.whereType<String>().toList();
    return _answers.where((a) => !selected.contains(a)).toList();
  }

  final List<_SentenceData> _sentences = [
    _SentenceData(
      parts: ['The accident ', ' ', ' place while I ', ' ', ' a driving lesson.'],
      correctAnswer: 'took',
      targetIndex: 0,
    ),
    _SentenceData(
      parts: ['The accident ', ' ', ' place while I ', ' ', ' a driving lesson.'],
      correctAnswer: 'was having',
      targetIndex: 1,
    ),
    _SentenceData(
      parts: ['Last night they ', ' ', ' in bed when they ', ' ', ' a strange noise.'],
      correctAnswer: 'were trying',
      targetIndex: 2,
    ),
    _SentenceData(
      parts: ['My father ', ' ', ' on the radio while my mom ', ' ', '.'],
      correctAnswer: 'was reading',
      targetIndex: 3,
    ),
    _SentenceData(
      parts: ['Some people were waiting at the bus stop. While I ', ' ', ' the street, I ', ' ', ' an accident.'],
      correctAnswer: 'was watching',
      targetIndex: 4,
    ),
    _SentenceData(
      parts: ['A car couldn\'t stop at the traffic lights and ', ' ', ' another car.'],
      correctAnswer: 'hit',
      targetIndex: 5,
    ),
    _SentenceData(
      parts: ['I ', ' ', ' by the window and watch the street.'],
      correctAnswer: 'was sitting',
      targetIndex: 6,
    ),
    _SentenceData(
      parts: ['I ', ' ', ' an accident.'],
      correctAnswer: 'witnessed',
      targetIndex: 7,
    ),
  ];

  void _onAnswerDropped(int index, String answer) {
    setState(() {
      _selectedAnswers[index] = answer;
      _submitted = false;
    });
  }

  void _removeAnswer(int index) {
    setState(() {
      _selectedAnswers[index] = null;
      _submitted = false;
    });
  }

  void _checkAnswers() {
    if (_selectedAnswers.any((item) => item == null)) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng điền tất cả các ô trống.')),
      );
      return;
    }

    setState(() {
      _submitted = true;
    });

    final score = _sentences
        .where((question) => _selectedAnswers[question.targetIndex] == question.correctAnswer)
        .length;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Bạn đã trả lời đúng $score/${_sentences.length} câu.')),
    );
  }

  void _resetGame() {
    setState(() {
      for (var i = 0; i < _selectedAnswers.length; i++) {
        _selectedAnswers[i] = null;
      }
      _submitted = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoadingRole) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final currentLessonTitle = _lessonTitles[_selectedLessonIndex];

    return Scaffold(
      backgroundColor: const Color(0xFFF5F8FF),
      appBar: AppBar(
        title: const Text('Bài học học viên'),
        backgroundColor: const Color(0xFF3D5AFE),
        elevation: 0,
      ),
      body: LayoutBuilder(
        builder: (context, constraints) {
          if (constraints.maxWidth >= 900) {
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildLessonList(constraints.maxWidth * 0.25),
                Expanded(child: _buildLessonContent(currentLessonTitle, constraints.maxWidth * 0.75)),
              ],
            );
          }
          return Column(
            children: [
              _buildLessonList(constraints.maxWidth),
              Expanded(child: _buildLessonContent(currentLessonTitle, constraints.maxWidth)),
            ],
          );
        },
      ),
    );
  }

  Widget _buildLessonList(double width) {
    return Container(
      width: width,
      decoration: const BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black12, blurRadius: 10, offset: Offset(0, 4))],
      ),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
            color: const Color(0xFF3D5AFE),
            child: const Text(
              'Danh sách bài học',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(12),
              itemCount: _lessonTitles.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final selected = index == _selectedLessonIndex;
                return InkWell(
                  onTap: () {
                    if (!selected) {
                      setState(() => _selectedLessonIndex = index);
                      _setVideoForLesson(_lessonTitles[index]);
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                    decoration: BoxDecoration(
                      color: selected ? Colors.blue.shade50 : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: selected ? Colors.blue.shade200 : Colors.transparent),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            _lessonTitles[index],
                            style: TextStyle(
                              fontWeight: selected ? FontWeight.bold : FontWeight.w500,
                              color: selected ? Colors.blue.shade700 : Colors.black87,
                            ),
                          ),
                        ),
                        if (selected)
                          Icon(Icons.check_circle, color: Colors.blue.shade700, size: 20)
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonContent(String lessonTitle, double width) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              lessonTitle,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Expanded(
                  child: Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                    clipBehavior: Clip.hardEdge,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: double.infinity,
                          height: 220,
                          color: Colors.black87,
                          child: _isVideoLoading
                              ? const Center(child: CircularProgressIndicator(color: Colors.white))
                              : _videoError != null
                                  ? Center(
                                      child: Text(
                                        _videoError!,
                                        style: const TextStyle(color: Colors.white),
                                        textAlign: TextAlign.center,
                                      ),
                                    )
                                  : _videoController != null && _videoController!.value.isInitialized
                                      ? Stack(
                                          alignment: Alignment.bottomCenter,
                                          children: [
                                            VideoPlayer(_videoController!),
                                            VideoProgressIndicator(_videoController!, allowScrubbing: true),
                                            Positioned(
                                              bottom: 8,
                                              right: 8,
                                              child: IconButton(
                                                icon: Icon(
                                                  _videoController!.value.isPlaying ? Icons.pause_circle : Icons.play_circle,
                                                  size: 40,
                                                  color: Colors.white,
                                                ),
                                                onPressed: () {
                                                  setState(() {
                                                    if (_videoController!.value.isPlaying) {
                                                      _videoController!.pause();
                                                    } else {
                                                      _videoController!.play();
                                                    }
                                                  });
                                                },
                                              ),
                                            ),
                                          ],
                                        )
                                      : const Center(
                                          child: Icon(Icons.play_circle_fill, color: Colors.white, size: 64),
                                        ),
                        ),
                        Padding(
                          padding: const EdgeInsets.all(16),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: const [
                              Text('Video bài học', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                              SizedBox(height: 8),
                              Text('Xem video hướng dẫn và thực hành theo nội dung bài học.'),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (width >= 900) const SizedBox(width: 16),
                if (width >= 900)
                  SizedBox(
                    width: 220,
                    child: Card(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: const [
                            Text('Hướng dẫn', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            SizedBox(height: 10),
                            Text('1. Đọc nội dung câu.\n2. Kéo từ vào ô trống phù hợp.\n3. Kiểm tra đáp án và sửa nếu cần.'),
                          ],
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Bài tập', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildExerciseArea(width),
          ],
        ),
      ),
    );
  }

  Widget _buildExerciseArea(double width) {
    final isWide = width >= 900;
    final exercisePanel = Expanded(
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: _sentences.length,
        itemBuilder: (context, index) {
          final item = _sentences[index];
          final selected = _selectedAnswers[item.targetIndex];
          final isCorrect = selected == item.correctAnswer;
          return Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            margin: const EdgeInsets.only(bottom: 14),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Câu ${index + 1}', style: const TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: item.parts.map((part) {
                      if (part == ' ') {
                        return GestureDetector(
                          onTap: selected != null ? () => _removeAnswer(item.targetIndex) : null,
                          child: DragTarget<String>(
                            builder: (context, candidateData, rejectedData) {
                              final borderColor = _submitted
                                  ? (selected == null
                                      ? Colors.redAccent
                                      : isCorrect
                                          ? Colors.green
                                          : Colors.orange)
                                  : Colors.blueGrey;
                              return Container(
                                margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                decoration: BoxDecoration(
                                  color: selected == null ? Colors.white : const Color(0xFFE8F0FF),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: borderColor, width: 1.6),
                                ),
                                child: SizedBox(
                                  width: 130,
                                  child: Text(
                                    selected ?? 'Kéo đáp án vào đây',
                                    style: TextStyle(
                                      color: selected == null ? Colors.black45 : Colors.black87,
                                      fontWeight: selected != null ? FontWeight.w600 : FontWeight.normal,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ),
                              );
                            },
                            onWillAcceptWithDetails: (_) => true,
                            onAcceptWithDetails: (details) => _onAnswerDropped(item.targetIndex, details.data),
                          ),
                        );
                      }
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(part, style: const TextStyle(fontSize: 15, height: 1.6)),
                      );
                    }).toList(),
                  ),
                  if (_submitted && selected != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 10),
                      child: Text(
                        isCorrect ? 'Đúng' : 'Sai, đáp án đúng: ${item.correctAnswer}',
                        style: TextStyle(
                          color: isCorrect ? Colors.green[700] : Colors.red[700],
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );

    final answerBank = SizedBox(
      width: isWide ? 260 : double.infinity,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Nháp đáp án', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 12),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _availableAnswers.map((answer) {
                  return Draggable<String>(
                    data: answer,
                    feedback: Material(
                      color: Colors.transparent,
                      child: Chip(
                        backgroundColor: const Color(0xFF3D5AFE),
                        label: Text(answer, style: const TextStyle(color: Colors.white)),
                      ),
                    ),
                    childWhenDragging: Opacity(
                      opacity: 0.4,
                      child: Chip(label: Text(answer), backgroundColor: Colors.grey[200]),
                    ),
                    child: Chip(label: Text(answer), backgroundColor: const Color(0xFFE3F2FD)),
                  );
                }).toList(),
              ),
              const SizedBox(height: 18),
              ElevatedButton(
                onPressed: _checkAnswers,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF3D5AFE),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  minimumSize: const Size.fromHeight(48),
                ),
                child: const Text('Kiểm tra đáp án'),
              ),
              const SizedBox(height: 12),
              OutlinedButton(
                onPressed: _resetGame,
                style: OutlinedButton.styleFrom(
                  foregroundColor: const Color(0xFF3D5AFE),
                  minimumSize: const Size.fromHeight(48),
                ),
                child: const Text('Làm lại'),
              ),
            ],
          ),
        ),
      ),
    );

    if (isWide) {
      return Padding(
        padding: const EdgeInsets.only(top: 16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: exercisePanel),
            const SizedBox(width: 16),
            answerBank,
          ],
        ),
      );
    }

    return Column(
      children: [
        exercisePanel,
        const SizedBox(height: 16),
        answerBank,
      ],
    );
  }
}

class _SentenceData {
  final List<String> parts;
  final String correctAnswer;
  final int targetIndex;

  _SentenceData({
    required this.parts,
    required this.correctAnswer,
    required this.targetIndex,
  });
}
