import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

import '../../dich_vu/dich_vu_bai_hoc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class LessonDragMatchScreen extends StatefulWidget {
  const LessonDragMatchScreen({super.key});

  @override
  State<LessonDragMatchScreen> createState() => _LessonDragMatchScreenState();
}

enum ExerciseType { dragDrop, multipleChoice, fillBlank, arrangeWords }

class _ExerciseItem {
  final List<String> parts;
  final String correctAnswer;
  final int targetIndex;
  final List<String> options;

  const _ExerciseItem({
    required this.parts,
    required this.correctAnswer,
    required this.targetIndex,
    required this.options,
  });
}

class _LessonExerciseSet {
  final ExerciseType type;
  final List<_ExerciseItem> items;

  const _LessonExerciseSet({
    required this.type,
    required this.items,
  });
}

class _LessonDragMatchScreenState extends State<LessonDragMatchScreen> {
  static const String _fallbackVideoUrl = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

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
    'Lesson 1A.8: Tiếng Anh Chiều',
    'Lesson 1A.9: Tiếng Anh Tối',
    'Lesson 1B.1: Vocabulary',
    'Lesson 1B.2: Listening a',
    'Lesson 1B.3: Language Focus',
    'Lesson 1B.4: Reading',
    'Lesson 1B.5: Listening b',
    'Lesson 1B.6: Speaking',
  ];

  int _selectedLessonIndex = 11;
  List<String?> _selectedAnswers = [];
  List<List<String>> _arrangedSelections = [];
  bool _submitted = false;
  List<_ExerciseItem> _sentences = [];
  ExerciseType _currentExerciseType = ExerciseType.dragDrop;
  List<TextEditingController> _textControllers = [];
  final Map<String, bool> _lessonCompleted = {};
  final Map<String, int> _lessonScores = {};

  final Map<String, _LessonExerciseSet> _lessonExerciseLibrary = {
    'Lesson 1A.0: Introduction': const _LessonExerciseSet(
      type: ExerciseType.dragDrop,
      items: [
        _ExerciseItem(parts: ['Hello, my name ', ' ', '.'], correctAnswer: 'is', targetIndex: 0, options: ['is', 'am', 'are', 'was']),
        _ExerciseItem(parts: ['I ', ' ', ' from Hanoi.'], correctAnswer: 'am', targetIndex: 1, options: ['am', 'is', 'are', 'were']),
        _ExerciseItem(parts: ['Nice to ', ' ', ' you.'], correctAnswer: 'meet', targetIndex: 2, options: ['meet', 'see', 'know', 'help']),
        _ExerciseItem(parts: ['How ', ' ', ' you today?'], correctAnswer: 'are', targetIndex: 3, options: ['are', 'is', 'were', 'be']),
      ],
    ),
    'Lesson 1A.1: Reading': const _LessonExerciseSet(
      type: ExerciseType.multipleChoice,
      items: [
        _ExerciseItem(parts: ['She ', ' ', ' a book every night.'], correctAnswer: 'reads', targetIndex: 0, options: ['reads', 'read', 'reading', 'reads']),
        _ExerciseItem(parts: ['They ', ' ', ' in the park.'], correctAnswer: 'play', targetIndex: 1, options: ['play', 'plays', 'playing', 'played']),
        _ExerciseItem(parts: ['We ', ' ', ' to the teacher.'], correctAnswer: 'listen', targetIndex: 2, options: ['listen', 'listens', 'listened', 'listening']),
        _ExerciseItem(parts: ['It ', ' ', ' sunny today.'], correctAnswer: 'is', targetIndex: 3, options: ['is', 'are', 'was', 'be']),
      ],
    ),
    'Lesson 1A.2: Post - Reading': const _LessonExerciseSet(
      type: ExerciseType.fillBlank,
      items: [
        _ExerciseItem(parts: ['I ', ' ', ' a letter yesterday.'], correctAnswer: 'wrote', targetIndex: 0, options: ['wrote', 'write', 'writes', 'writing']),
        _ExerciseItem(parts: ['He ', ' ', ' his homework.'], correctAnswer: 'finished', targetIndex: 1, options: ['finished', 'finish', 'finishes', 'finishing']),
        _ExerciseItem(parts: ['We ', ' ', ' lunch at noon.'], correctAnswer: 'had', targetIndex: 2, options: ['had', 'have', 'has', 'having']),
        _ExerciseItem(parts: ['They ', ' ', ' to the store.'], correctAnswer: 'went', targetIndex: 3, options: ['went', 'go', 'goes', 'going']),
      ],
    ),
    'Lesson 1A.3: Listening A': const _LessonExerciseSet(
      type: ExerciseType.dragDrop,
      items: [
        _ExerciseItem(parts: ['I ', ' ', ' music every morning.'], correctAnswer: 'listen to', targetIndex: 0, options: ['listen to', 'listen', 'listened', 'listening']),
        _ExerciseItem(parts: ['She ', ' ', ' the teacher carefully.'], correctAnswer: 'heard', targetIndex: 1, options: ['heard', 'hear', 'hears', 'hearing']),
        _ExerciseItem(parts: ['We ', ' ', ' the announcement.'], correctAnswer: 'understood', targetIndex: 2, options: ['understood', 'understand', 'understanding', 'understands']),
        _ExerciseItem(parts: ['They ', ' ', ' a story.'], correctAnswer: 'listened to', targetIndex: 3, options: ['listened to', 'listen to', 'listening to', 'heard']),
      ],
    ),
    'Lesson 1A.5: Speaking': const _LessonExerciseSet(
      type: ExerciseType.arrangeWords,
      items: [
        _ExerciseItem(parts: ['Sắp xếp các từ để thành câu đúng:'], correctAnswer: 'I go to school', targetIndex: 0, options: ['I', 'go', 'to', 'school']),
        _ExerciseItem(parts: ['Sắp xếp các từ để thành câu đúng:'], correctAnswer: 'She is reading a book', targetIndex: 1, options: ['She', 'is', 'reading', 'a', 'book']),
      ],
    ),
    'Lesson 1A.6: Language Focus B': const _LessonExerciseSet(
      type: ExerciseType.arrangeWords,
      items: [
        _ExerciseItem(parts: ['Sắp xếp các từ để thành câu đúng:'], correctAnswer: 'They are playing football', targetIndex: 0, options: ['They', 'are', 'playing', 'football']),
        _ExerciseItem(parts: ['Sắp xếp các từ để thành câu đúng:'], correctAnswer: 'I have never been there', targetIndex: 1, options: ['I', 'have', 'never', 'been', 'there']),
      ],
    ),
    'Lesson 1A.8: Tiếng Anh Chiều': const _LessonExerciseSet(
      type: ExerciseType.dragDrop,
      items: [
        _ExerciseItem(parts: ['In the afternoon, I ', ' ', ' my homework.'], correctAnswer: 'do', targetIndex: 0, options: ['do', 'does', 'did', 'doing']),
        _ExerciseItem(parts: ['We ', ' ', ' in the park after school.'], correctAnswer: 'play', targetIndex: 1, options: ['play', 'plays', 'played', 'playing']),
        _ExerciseItem(parts: ['She always ', ' ', ' tea in the evening.'], correctAnswer: 'drinks', targetIndex: 2, options: ['drinks', 'drink', 'drinking', 'drank']),
        _ExerciseItem(parts: ['They ', ' ', ' music later tonight.'], correctAnswer: 'listen to', targetIndex: 3, options: ['listen to', 'listens to', 'listened to', 'listening to']),
      ],
    ),
    'Lesson 1A.9: Tiếng Anh Tối': const _LessonExerciseSet(
      type: ExerciseType.fillBlank,
      items: [
        _ExerciseItem(parts: ['He ', ' ', ' television every night.'], correctAnswer: 'watches', targetIndex: 0, options: ['watch', 'watches', 'watched', 'watching']),
        _ExerciseItem(parts: ['We ', ' ', ' dinner together in the evening.'], correctAnswer: 'have', targetIndex: 1, options: ['have', 'has', 'had', 'having']),
        _ExerciseItem(parts: ['I ', ' ', ' to bed early.'], correctAnswer: 'go', targetIndex: 2, options: ['go', 'goes', 'went', 'going']),
        _ExerciseItem(parts: ['She ', ' ', ' her homework before sleep.'], correctAnswer: 'finishes', targetIndex: 3, options: ['finish', 'finishes', 'finished', 'finishing']),
      ],
    ),
    'default': const _LessonExerciseSet(
      type: ExerciseType.dragDrop,
      items: [
        _ExerciseItem(parts: ['The accident ', ' ', ' place while I ', ' ', ' a driving lesson.'], correctAnswer: 'took', targetIndex: 0, options: ['took', 'was', 'had', 'went']),
        _ExerciseItem(parts: ['The accident ', ' ', ' place while I ', ' ', ' a driving lesson.'], correctAnswer: 'was having', targetIndex: 1, options: ['was having', 'had', 'was', 'took']),
        _ExerciseItem(parts: ['Last night they ', ' ', ' in bed when they ', ' ', ' a strange noise.'], correctAnswer: 'were trying', targetIndex: 2, options: ['were trying', 'tried', 'try', 'trying']),
        _ExerciseItem(parts: ['My father ', ' ', ' on the radio while my mom ', ' ', '.'], correctAnswer: 'was reading', targetIndex: 3, options: ['was reading', 'read', 'was', 'reading']),
      ],
    ),
  };

  @override
  void initState() {
    super.initState();
    _loadUserRole();
    _loadLessonVideos();
    _initializeExerciseData(_lessonTitles[_selectedLessonIndex]);
  }

  void _initializeExerciseData(String lessonTitle) {
    final lessonSet = _lessonExerciseLibrary[lessonTitle] ?? _lessonExerciseLibrary['default']!;
    _sentences = lessonSet.items;
    _currentExerciseType = lessonSet.type;
    _selectedAnswers = List<String?>.filled(lessonSet.items.length, null);
    _arrangedSelections = List.generate(lessonSet.items.length, (_) => []);
    for (final controller in _textControllers) {
      controller.dispose();
    }
    _textControllers = List.generate(lessonSet.items.length, (_) => TextEditingController());
    _submitted = false;
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
      orElse: () => <String, dynamic>{},
    );

    final rawVideoUrl = selectedLesson['VideoUrl']?.toString();
    final normalized = rawVideoUrl?.trim() ?? '';
    final videoUrl = (normalized.isNotEmpty && normalized.toLowerCase().endsWith('.mp4'))
        ? normalized
        : _fallbackVideoUrl;

    _initializeExerciseData(lessonTitle);

    _videoController?.dispose();
    setState(() {
      _isVideoLoading = true;
      _videoError = null;
      _videoController = null;
    });

    try {
      final controller = VideoPlayerController.networkUrl(Uri.parse(videoUrl));
      await controller.initialize();
      controller.setLooping(false);
      setState(() {
        _videoController = controller;
        _isVideoLoading = false;
      });
    } catch (e) {
      setState(() {
        _videoError = 'Video không phát được trên trình duyệt này. Thử chọn bài khác hoặc tải lại.';
        _isVideoLoading = false;
      });
    }
  }

  @override
  void dispose() {
    _videoController?.dispose();
    for (final controller in _textControllers) {
      controller.dispose();
    }
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

  void _onAnswerDropped(int index, String answer) {
    if (_submitted) return;
    setState(() {
      _selectedAnswers[index] = answer;
      _submitted = false;
    });
  }

  void _removeAnswer(int index) {
    if (_submitted) return;
    setState(() {
      _selectedAnswers[index] = null;
      _arrangedSelections[index].clear();
      _textControllers[index].clear();
      _submitted = false;
    });
  }

  void _onArrangeWord(int index, String word) {
    if (_submitted) return;
    setState(() {
      if (!_arrangedSelections[index].contains(word)) {
        _arrangedSelections[index].add(word);
      }
      _selectedAnswers[index] = _arrangedSelections[index].join(' ');
      _submitted = false;
    });
  }

  void _removeArrangedWord(int index, int wordIndex) {
    if (_submitted) return;
    setState(() {
      _arrangedSelections[index].removeAt(wordIndex);
      _selectedAnswers[index] = _arrangedSelections[index].join(' ');
      _submitted = false;
    });
  }

  void _goToNextLesson() {
    final lessonTitle = _lessonTitles[_selectedLessonIndex];
    if (_lessonCompleted[lessonTitle] != true) return;
    if (_selectedLessonIndex < _lessonTitles.length - 1) {
      setState(() {
        _selectedLessonIndex += 1;
      });
      _initializeExerciseData(_lessonTitles[_selectedLessonIndex]);
      _setVideoForLesson(_lessonTitles[_selectedLessonIndex]);
    }
  }

  void _checkAnswers() {
    final hasBlankAnswer = _selectedAnswers.any((item) => item == null || item.trim().isEmpty);
    if (hasBlankAnswer) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Vui lòng hoàn thành tất cả các câu hỏi trước khi kiểm tra.')),
      );
      return;
    }

    final score = _sentences.where((question) {
      final answer = _selectedAnswers[question.targetIndex]?.trim().toLowerCase();
      return answer == question.correctAnswer.toLowerCase();
    }).length;

    final lessonTitle = _lessonTitles[_selectedLessonIndex];
    final isLessonComplete = score == _sentences.length;

    setState(() {
      _submitted = true;
      _lessonScores[lessonTitle] = score;
      _lessonCompleted[lessonTitle] = isLessonComplete;
    });

    if (isLessonComplete) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hoàn thành bài học! Bạn đạt $score/${_sentences.length} điểm.')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Bạn đã trả lời đúng $score/${_sentences.length} câu. Hãy thử lại để hoàn thành.')),
      );
    }
  }

  void _resetGame() {
    final lessonTitle = _lessonTitles[_selectedLessonIndex];
    setState(() {
      for (var i = 0; i < _selectedAnswers.length; i++) {
        _selectedAnswers[i] = null;
        _arrangedSelections[i].clear();
        _textControllers[i].clear();
      }
      _submitted = false;
      _lessonCompleted[lessonTitle] = false;
      _lessonScores.remove(lessonTitle);
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
                final title = _lessonTitles[index];
                final completed = _lessonCompleted[title] == true;
                return InkWell(
                  onTap: () {
                    if (!selected) {
                      setState(() => _selectedLessonIndex = index);
                      _setVideoForLesson(title);
                    }
                  },
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
                    decoration: BoxDecoration(
                      color: completed ? Colors.green.shade50 : selected ? Colors.blue.shade50 : Colors.grey.shade100,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: selected ? Colors.blue.shade200 : Colors.transparent),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Text(
                            title,
                            style: TextStyle(
                              fontWeight: selected ? FontWeight.bold : FontWeight.w500,
                              color: completed ? Colors.green.shade700 : selected ? Colors.blue.shade700 : Colors.black87,
                            ),
                          ),
                        ),
                        if (completed)
                          const Icon(Icons.check_circle, color: Colors.green, size: 20)
                        else if (selected)
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
    final completed = _lessonCompleted[lessonTitle] == true;
    final score = _lessonScores[lessonTitle];
    final answeredCount = _selectedAnswers.where((answer) => answer != null && answer.trim().isNotEmpty).length;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    lessonTitle,
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                ),
                if (completed)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.green.shade100,
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Row(
                      children: const [
                        Icon(Icons.check_circle, color: Colors.green, size: 18),
                        SizedBox(width: 6),
                        Text('Hoàn thành', style: TextStyle(color: Colors.green, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            if (answeredCount > 0)
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Text('Đã hoàn thành: $answeredCount/${_sentences.length} câu', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            if (_submitted && score != null)
              Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Text('Điểm: $score/${_sentences.length}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.green)),
              ),
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
            if (completed)
              Card(
                color: Colors.green.shade50,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Bài học đã hoàn thành với $score/${_sentences.length} câu đúng.', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: _resetGame,
                              child: const Text('Làm lại'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: _goToNextLesson,
                              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF3D5AFE)),
                              child: const Text('Qua bài tiếp theo'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              )
            else
              _buildExerciseArea(width),
          ],
        ),
      ),
    );
  }

  Widget _buildResultChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text('$label: ', style: TextStyle(color: color, fontWeight: FontWeight.w700)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }

  Widget _buildExerciseArea(double width) {
    final lessonTitle = _lessonTitles[_selectedLessonIndex];
    final score = _lessonScores[lessonTitle];
    final totalQuestions = _sentences.length;
    final correctCount = score ?? 0;
    final wrongCount = totalQuestions - correctCount;
    final isCompleted = _lessonCompleted[lessonTitle] == true;

    final exercisePanel = ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _sentences.length,
      itemBuilder: (context, index) {
        final item = _sentences[index];
        final selected = _selectedAnswers[item.targetIndex];
        final isCorrect = selected != null && selected.trim().toLowerCase() == item.correctAnswer.toLowerCase();

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
                if (_currentExerciseType == ExerciseType.dragDrop) ...[
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: item.parts.map((part) {
                      if (part == ' ') {
                        if (_submitted) {
                          return Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFE8F0FF),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.blueGrey, width: 1.6),
                            ),
                            child: SizedBox(
                              width: 130,
                              child: Text(
                                item.correctAnswer,
                                style: const TextStyle(color: Colors.black87, fontWeight: FontWeight.w600),
                                textAlign: TextAlign.center,
                              ),
                            ),
                          );
                        }
                        return GestureDetector(
                          onTap: selected != null ? () => _removeAnswer(item.targetIndex) : null,
                          child: DragTarget<String>(
                            builder: (context, candidateData, rejectedData) {
                              final borderColor = _submitted
                                  ? (selected == null || selected.trim().isEmpty
                                      ? Colors.redAccent
                                      : isCorrect
                                          ? Colors.green
                                          : Colors.orange)
                                  : Colors.blueGrey;
                              return Container(
                                margin: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                decoration: BoxDecoration(
                                  color: selected == null || selected.trim().isEmpty ? Colors.white : const Color(0xFFE8F0FF),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: borderColor, width: 1.6),
                                ),
                                child: SizedBox(
                                  width: 130,
                                  child: Text(
                                    selected ?? 'Kéo từ vào đây',
                                    style: TextStyle(
                                      color: selected == null || selected.trim().isEmpty ? Colors.black45 : Colors.black87,
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
                  const SizedBox(height: 12),
                  const Text('Kéo thả từ vào chỗ trống', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  if (!_submitted)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: item.options.where((option) => option.toLowerCase() != selected?.trim().toLowerCase()).map((option) {
                        return Draggable<String>(
                          data: option,
                          feedback: Material(
                            color: Colors.transparent,
                            child: Chip(
                              backgroundColor: const Color(0xFF3D5AFE),
                              label: Text(option, style: const TextStyle(color: Colors.white)),
                            ),
                          ),
                          childWhenDragging: Opacity(
                            opacity: 0.4,
                            child: Chip(label: Text(option), backgroundColor: Colors.grey[200]),
                          ),
                          child: Chip(label: Text(option), backgroundColor: const Color(0xFFE3F2FD)),
                        );
                      }).toList(),
                    ),
                ] else if (_currentExerciseType == ExerciseType.multipleChoice) ...[
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: item.parts.map((part) {
                      if (part == ' ') {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                            decoration: BoxDecoration(
                              color: selected == null || selected.trim().isEmpty ? Colors.white : const Color(0xFFE8F0FF),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Colors.blueGrey, width: 1.2),
                            ),
                            child: Text(
                              _submitted ? item.correctAnswer : (selected ?? 'Chọn đáp án'),
                              style: TextStyle(color: selected == null || selected.trim().isEmpty ? Colors.black45 : Colors.black87),
                            ),
                          ),
                        );
                      }
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(part, style: const TextStyle(fontSize: 15, height: 1.6)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                  const Text('Chọn đáp án đúng', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  if (!_submitted)
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: List.generate(item.options.length, (optionIndex) {
                        final option = item.options[optionIndex];
                        final label = ['A', 'B', 'C', 'D'][optionIndex];
                        final isSelected = selected?.trim().toLowerCase() == option.toLowerCase();
                        return ChoiceChip(
                          label: Text('$label. $option'),
                          selected: isSelected,
                          selectedColor: const Color(0x293D5AFE),
                          onSelected: (_) => _onAnswerDropped(item.targetIndex, option),
                        );
                      }),
                    ),
                ] else if (_currentExerciseType == ExerciseType.fillBlank) ...[
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: item.parts.map((part) {
                      if (part == ' ') {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                          child: _submitted
                              ? Container(
                                  width: 150,
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFE8F0FF),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(color: Colors.blueGrey, width: 1.2),
                                  ),
                                  child: Text(
                                    item.correctAnswer,
                                    style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                                    textAlign: TextAlign.center,
                                  ),
                                )
                              : SizedBox(
                                  width: 150,
                                  child: TextField(
                                    controller: _textControllers[item.targetIndex],
                                    decoration: const InputDecoration(
                                      hintText: 'Điền từ vào đây',
                                      border: OutlineInputBorder(),
                                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                    ),
                                    onChanged: (value) => _onAnswerDropped(item.targetIndex, value),
                                  ),
                                ),
                        );
                      }
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(part, style: const TextStyle(fontSize: 15, height: 1.6)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 8),
                  Text('Gợi ý: điền đúng từ vào chỗ trống.', style: TextStyle(color: Colors.grey[700])),
                ] else if (_currentExerciseType == ExerciseType.arrangeWords) ...[
                  Text(item.parts.join(' '), style: const TextStyle(fontSize: 15, height: 1.6)),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: item.options.map((option) {
                      final isSelected = _arrangedSelections[item.targetIndex].contains(option);
                      return ChoiceChip(
                        label: Text(option),
                        selected: isSelected,
                        onSelected: (_) => _onArrangeWord(item.targetIndex, option),
                        selectedColor: const Color(0x293D5AFE),
                        disabledColor: isSelected ? Colors.blue.shade100 : null,
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 16),
                  const Text('Câu trả lời hiện tại:', style: TextStyle(fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: _arrangedSelections[item.targetIndex].asMap().entries.map((entry) {
                      final wordIndex = entry.key;
                      final word = entry.value;
                      return Chip(
                        label: Text(word),
                        deleteIcon: !_submitted ? const Icon(Icons.close, size: 18) : null,
                        onDeleted: !_submitted ? () => _removeArrangedWord(item.targetIndex, wordIndex) : null,
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 12),
                  if (_submitted)
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Text('Đáp án đúng: ${item.correctAnswer}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    ),
                  if (_submitted && selected != null)
                    Text(
                      isCorrect ? 'Đúng' : 'Sai, đáp án đúng: ${item.correctAnswer}',
                      style: TextStyle(
                        color: isCorrect ? Colors.green[700] : Colors.red[700],
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                ] else ...[
                  Wrap(
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: item.parts.map((part) {
                      if (part == ' ') {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
                          child: SizedBox(
                            width: 150,
                            child: TextField(
                              controller: _textControllers[item.targetIndex],
                              decoration: const InputDecoration(
                                hintText: 'Điền từ vào đây',
                                border: OutlineInputBorder(),
                                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              ),
                              onChanged: (value) => _onAnswerDropped(item.targetIndex, value),
                            ),
                          ),
                        );
                      }
                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 4),
                        child: Text(part, style: const TextStyle(fontSize: 15, height: 1.6)),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: 8),
                  Text('Gợi ý: điền đúng từ vào chỗ trống.', style: TextStyle(color: Colors.grey[700])),
                  if (_submitted)
                    Padding(
                      padding: const EdgeInsets.only(top: 10),
                      child: Text('Đáp án: ${item.correctAnswer}', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                    ),
                ],
                if (_submitted)
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
    );

    final actionPanel = SizedBox(
      width: double.infinity,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        color: _submitted ? (isCompleted ? Colors.green.shade50 : Colors.orange.shade50) : Colors.white,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: _submitted
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isCompleted ? 'Bài học hoàn thành' : 'Kết quả bài tập',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    Wrap(
                      spacing: 16,
                      runSpacing: 10,
                      children: [
                        _buildResultChip('Đúng', '$correctCount/$totalQuestions', Colors.green),
                        _buildResultChip('Sai', '$wrongCount/$totalQuestions', Colors.red),
                        _buildResultChip('Điểm', '$correctCount/$totalQuestions', const Color(0xFF3D5AFE)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: _resetGame,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: const Color(0xFF3D5AFE),
                              minimumSize: const Size.fromHeight(48),
                            ),
                            child: const Text('Làm lại'),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: isCompleted ? _goToNextLesson : null,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFF3D5AFE),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              minimumSize: const Size.fromHeight(48),
                            ),
                            child: const Text('Qua bài tiếp theo'),
                          ),
                        ),
                      ],
                    ),
                  ],
                )
              : Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Nộp bài', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
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

    return Padding(
      padding: const EdgeInsets.only(top: 16),
      child: Column(
        children: [
          exercisePanel,
          const SizedBox(height: 16),
          actionPanel,
        ],
      ),
    );
  }
}

