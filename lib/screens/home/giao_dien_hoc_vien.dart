import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../thanh_phan/thanh_menu.dart';
import '../student/giao_dien_danh_sach_lop_hoc_vien.dart';
import '../student/giao_dien_dang_ky_khoa_hoc.dart';
import '../student/giao_dien_khoa_hoc_hoc_vien.dart';
import '../student/giao_dien_tra_tu.dart';
import '../student/giao_dien_hoc_tap.dart';

class GiaoDienHocVien extends StatefulWidget {
  const GiaoDienHocVien({super.key});

  @override
  State<GiaoDienHocVien> createState() => _GiaoDienHocVienState();
}

class _GiaoDienHocVienState extends State<GiaoDienHocVien> {
  String userName = 'Học viên';
  int _currentIndex = 0;
  int _selectedLessonIndex = 11;

  final List<Map<String, dynamic>> _lessonTitles = [
    {'title': 'Lesson 1A.0: Introduction', 'xp': 40, 'done': true},
    {'title': 'Lesson 1A.1: Reading', 'xp': 55, 'done': true},
    {'title': 'Lesson 1A.2: Post - Reading', 'xp': 60, 'done': false},
    {'title': 'Lesson 1A.3: Listening A', 'xp': 50, 'done': false},
    {'title': 'Lesson 1A.4: Listening B', 'xp': 65, 'done': false},
    {'title': 'Lesson 1A.5: Speaking', 'xp': 70, 'done': false},
    {'title': 'Lesson 1A.6: Language Focus B', 'xp': 75, 'done': false},
    {'title': 'Lesson 1A.7: Language Focus A', 'xp': 80, 'done': false},
    {'title': 'Lesson 1B.1: Vocabulary', 'xp': 85, 'done': false},
    {'title': 'Lesson 1B.2: Listening a', 'xp': 90, 'done': false},
    {'title': 'Lesson 1B.3: Language Focus', 'xp': 95, 'done': false},
    {'title': 'Lesson 1B.4: Reading', 'xp': 100, 'done': false},
  ];

  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  Future<void> _loadUserName() async {
    final name = await UserSession.getUserName();
    setState(() {
      userName = name ?? userName;
    });
  }

  Future<void> _logout() async {
    await UserSession.logout();
    if (!mounted) return;
    Navigator.pushNamedAndRemoveUntil(
      context,
      AppRoutes.login,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final pages = [
      _buildStudentOverview(),
      _buildStudentCourses(),
      _buildStudentProfile(),
    ];

    return Scaffold(
      drawer: const ThanhMenu(),
      appBar: AppBar(
        title: const Text('Giao diện học viên'),
        backgroundColor: Colors.blue.shade700,
        actions: [
          IconButton(
            tooltip: 'Đăng xuất',
            icon: const Icon(Icons.logout),
            onPressed: _logout,
          ),
        ],
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        selectedItemColor: Colors.blue.shade700,
        unselectedItemColor: Colors.black54,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: 'Khóa học',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Hồ sơ'),
        ],
      ),
    );
  }

  Widget _buildStudentOverview() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeBanner(),
          const SizedBox(height: 20),
          _buildFeaturedLessonCard(),
          const SizedBox(height: 20),
          _buildQuickActionSection(),
          const SizedBox(height: 20),
          const Text(
            'Khám phá bài học',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          LinearProgressIndicator(
            value: 0.62,
            minHeight: 10,
            backgroundColor: Colors.grey.shade200,
            valueColor: const AlwaysStoppedAnimation(Color(0xFF4B8AF7)),
          ),
          const SizedBox(height: 12),
          const SizedBox(height: 12),
          _buildLessonMenu(),
        ],
      ),
    );
  }

  Widget _buildWelcomeBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF4B8AF7), Color(0xFF72B5FF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Xin chào',
                  style: TextStyle(color: Colors.white70, fontSize: 16),
                ),
                const SizedBox(height: 8),
                Text(
                  userName,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Tiếp tục luyện nghe và nói để giữ streak hôm nay nhé!',
                  style: TextStyle(color: Colors.white70, height: 1.4),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Streak 3 ngày • XP 540',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 18),
                Row(
                  children: [
                    _buildBannerBadge(Icons.star, 'Cấp 1'),
                    const SizedBox(width: 10),
                    _buildBannerBadge(
                      Icons.local_fire_department,
                      '3 ngày giữ streak',
                    ),
                  ],
                ),
              ],
            ),
          ),
          Container(
            width: 70,
            height: 70,
            decoration: BoxDecoration(
              color: Colors.white.withAlpha((0.18 * 255).round()),
              borderRadius: BorderRadius.circular(26),
            ),
            child: const Icon(
              Icons.auto_stories,
              color: Colors.white,
              size: 36,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBannerBadge(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha((0.18 * 255).round()),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 16),
          const SizedBox(width: 6),
          Text(
            label,
            style: const TextStyle(color: Colors.white, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildFeaturedLessonCard() {
    final selectedLesson = _lessonTitles[_selectedLessonIndex];
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF8A5CFF), Color(0xFF5C8BFF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.blue.shade100.withAlpha((0.4 * 255).round()),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(22),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Bài học nổi bật',
                style: TextStyle(color: Colors.white70, fontSize: 16),
              ),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(18),
                ),
                child: const Text(
                  'HOT',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            selectedLesson['title'],
            style: const TextStyle(
              color: Colors.white,
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 12),
          const Text(
            'Đọc đoạn hội thoại, xem bài giảng và hoàn thành bài tập kéo đáp án.',
            style: TextStyle(color: Colors.white70, fontSize: 15, height: 1.5),
          ),
          const SizedBox(height: 22),
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: () =>
                    Navigator.pushNamed(context, AppRoutes.lessonDragMatch),
                icon: const Icon(Icons.play_arrow),
                label: const Text('Bắt đầu'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: const Color(0xFF5C8BFF),
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 20,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                onPressed: () =>
                    Navigator.pushNamed(context, AppRoutes.progress),
                icon: const Icon(Icons.bar_chart),
                label: const Text('Tiến độ'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: Colors.white,
                  side: const BorderSide(color: Colors.white24),
                  padding: const EdgeInsets.symmetric(
                    vertical: 16,
                    horizontal: 20,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildLessonMenu() {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      elevation: 3,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Danh sách bài học',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            ...List.generate(_lessonTitles.length, (index) {
              final isSelected = index == _selectedLessonIndex;
              return Padding(
                padding: const EdgeInsets.only(bottom: 10),
                child: Material(
                  color: isSelected ? Colors.blue.shade50 : Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(18),
                    onTap: () => setState(() => _selectedLessonIndex = index),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 44,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? Colors.blue.shade700
                                  : Colors.blue.shade50,
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: Center(
                              child: Text(
                                '${index + 1}',
                                style: TextStyle(
                                  color: isSelected
                                      ? Colors.white
                                      : Colors.blue.shade700,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  _lessonTitles[index]['title'],
                                  style: TextStyle(
                                    fontWeight: isSelected
                                        ? FontWeight.bold
                                        : FontWeight.w600,
                                  ),
                                ),
                                const SizedBox(height: 6),
                                Text(
                                  isSelected ? 'Đang học' : (_lessonTitles[index]['done'] == true ? 'Đã hoàn thành' : 'Chưa học'),
                                  style: TextStyle(
                                    fontSize: 13,
                                    color: Colors.black54,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          if (isSelected)
                            Icon(
                              Icons.check_circle,
                              color: Colors.blue.shade700,
                            )
                          else if (_lessonTitles[index]['done'] == true)
                            const Icon(Icons.done_all, color: Colors.green),
                        ],
                      ),
                    ),
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Hành động nhanh',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 12),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          children: [
            _buildActionCard(
              Icons.menu_book,
              'Khóa học',
              'Đăng ký & xem học phần',
              () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudentCourseScreen()),
              ),
            ),
            _buildActionCard(
              Icons.class_,
              'Lớp học',
              'Xem lịch và thông tin lớp',
              () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const StudentClassListScreen(),
                ),
              ),
            ),
            _buildActionCard(
              Icons.translate,
              'Tra từ',
              'Tìm nghĩa và ví dụ',
              () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const DictionaryScreen()),
              ),
            ),
            _buildActionCard(
              Icons.menu_book,
              'Khám phá',
              'Xem các khóa học',
              () => Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (_) => const StudentCourseExplorerScreen(),
                ),
              ),
            ),
            _buildActionCard(
              Icons.school,
              'Bài học',
              'Luyện nghe và nói',
              () => Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const StudyScreen()),
              ),
            ),
            _buildActionCard(
              Icons.person,
              'Hồ sơ',
              'Thông tin cá nhân',
              () => Navigator.pushNamed(context, AppRoutes.profile),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildStudentCourses() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Khóa học',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _infoCard(
            'Đăng ký Khóa học',
            'Thêm khóa học mới và quản lý đăng ký',
            Icons.app_registration,
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const StudentCourseScreen()),
            ),
          ),
          const SizedBox(height: 12),
          _infoCard(
            'Danh sách Lớp',
            'Xem lớp học hiện tại',
            Icons.class_,
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const StudentClassListScreen()),
            ),
          ),
          const SizedBox(height: 12),
          _infoCard(
            'Học bài',
            'Mở nội dung bài học',
            Icons.school,
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const StudyScreen()),
            ),
          ),
          const SizedBox(height: 12),
          _infoCard(
            'Tra từ',
            'Tra nghĩa và ví dụ nhanh',
            Icons.translate,
            () => Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const DictionaryScreen()),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStudentProfile() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Hồ sơ',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          Card(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Xin chào, $userName',
                    style: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Text('Xem chi tiết hồ sơ và tiến độ học tập.'),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () =>
                        Navigator.pushNamed(context, AppRoutes.profile),
                    icon: const Icon(Icons.person),
                    label: const Text('Xem hồ sơ'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () =>
                        Navigator.pushNamed(context, AppRoutes.progress),
                    icon: const Icon(Icons.bar_chart),
                    label: const Text('Tiến độ học tập'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionCard(
    IconData icon,
    String title,
    String subtitle,
    VoidCallback onTap,
  ) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      margin: const EdgeInsets.only(bottom: 14),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(
          horizontal: 18,
          vertical: 18,
        ),
        leading: Container(
          decoration: BoxDecoration(
            color: Colors.blue.shade50,
            borderRadius: BorderRadius.circular(14),
          ),
          padding: const EdgeInsets.all(12),
          child: Icon(icon, size: 28, color: Colors.blue.shade700),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 18),
        onTap: onTap,
      ),
    );
  }

  Widget _infoCard(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: ListTile(
        leading: Icon(icon, color: Colors.blue.shade700),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 18),
        onTap: onTap,
      ),
    );
  }
}
