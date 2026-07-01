import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../thanh_phan/thanh_menu.dart';
import 'giao_dien_thay_the.dart';
import '../teacher/giao_dien_danh_sach_lop_hoc_giao_vien.dart';
import '../teacher/giao_dien_danh_sach_hoc_vien_giao_vien.dart';

class GiaoDienGiaoVien extends StatefulWidget {
  const GiaoDienGiaoVien({super.key});

  @override
  State<GiaoDienGiaoVien> createState() => _GiaoDienGiaoVienState();
}

class _GiaoDienGiaoVienState extends State<GiaoDienGiaoVien> {
  String userName = 'Giáo viên';
  int _currentIndex = 0;

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

  void _navigateTo(BuildContext context, Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
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
    final pages = [_buildDashboard(), _buildTeaching(), _buildProfile()];

    return Scaffold(
      drawer: const ThanhMenu(),
      appBar: AppBar(
        title: const Text('Giao diện giáo viên'),
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
          BottomNavigationBarItem(icon: Icon(Icons.school), label: 'Giảng dạy'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Hồ sơ'),
        ],
      ),
    );
  }

  Widget _buildDashboard() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.blue.shade50,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.blue.shade100,
                        blurRadius: 12,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Icon(
                    Icons.school,
                    size: 36,
                    color: Colors.blue.shade700,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Xin chào',
                        style: TextStyle(color: Colors.black54, fontSize: 16),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        userName,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        'Quản lý lớp học và học viên của bạn.',
                        style: TextStyle(color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            childAspectRatio: 2.4,
            children: [
              _buildSummaryCard(
                '7',
                'Lớp học',
                Icons.class_,
                const Color(0xFF34B1FF),
              ),
              _buildSummaryCard(
                '54',
                'Học viên',
                Icons.group,
                const Color(0xFF34D399),
              ),
              _buildSummaryCard(
                '12',
                'Bài kiểm tra',
                Icons.quiz,
                const Color(0xFFF59E0B),
              ),
              _buildSummaryCard(
                '4',
                'Khóa học',
                Icons.menu_book,
                const Color(0xFFEF4444),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Nhiệm vụ hôm nay',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 14),
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _buildQuickButton(
                Icons.class_,
                'Lớp học',
                () => _navigateTo(context, const TeacherClassListScreen()),
              ),
              _buildQuickButton(
                Icons.group,
                'Học viên',
                () => _navigateTo(context, const TeacherStudentListScreen()),
              ),
              _buildQuickButton(
                Icons.check_box,
                'Điểm danh',
                () => _navigateTo(
                  context,
                  const PlaceholderScreen(
                    title: 'Điểm danh',
                    description: 'Ghi danh học viên theo buổi học.',
                  ),
                ),
              ),
              _buildQuickButton(
                Icons.menu_book,
                'Bài học',
                () => _navigateTo(
                  context,
                  const PlaceholderScreen(
                    title: 'Quản lý bài học',
                    description: 'Tạo và chỉnh sửa bài học.',
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTeaching() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quản lý giảng dạy',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildInfoCard(
            'Lớp học',
            'Xem danh sách lớp và lịch dạy',
            Icons.class_,
            () => _navigateTo(context, const TeacherClassListScreen()),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Học viên',
            'Xem học viên và thông tin cá nhân',
            Icons.group,
            () => _navigateTo(context, const TeacherStudentListScreen()),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Điểm danh',
            'Quản lý điểm danh buổi học',
            Icons.check_box,
            () => _navigateTo(
              context,
              const PlaceholderScreen(
                title: 'Điểm danh',
                description: 'Ghi danh học viên theo buổi học.',
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Quản lý bài học',
            'Tạo và chỉnh sửa tài liệu',
            Icons.menu_book,
            () => _navigateTo(
              context,
              const PlaceholderScreen(
                title: 'Quản lý bài học',
                description: 'Tạo và chỉnh sửa bài học.',
              ),
            ),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Kiểm tra',
            'Tạo đề và chấm bài kiểm tra',
            Icons.quiz,
            () => _navigateTo(
              context,
              const PlaceholderScreen(
                title: 'Quản lý bài kiểm tra',
                description: 'Tạo và chỉnh sửa bài kiểm tra.',
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProfile() {
    return Padding(
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
                    userName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text('Vai trò: Giáo viên'),
                  const SizedBox(height: 16),
                  const Text(
                    'Xem và quản lý thông tin cá nhân cùng các lớp dạy.',
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () =>
                        _navigateTo(context, const TeacherClassListScreen()),
                    icon: const Icon(Icons.class_),
                    label: const Text('Lớp học của tôi'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _navigateTo(context, const TeacherStudentListScreen()),
                    icon: const Icon(Icons.group),
                    label: const Text('Học viên của tôi'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    onPressed: _logout,
                    icon: const Icon(Icons.logout),
                    label: const Text('Đăng xuất'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red.shade700,
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

  Widget _buildQuickButton(IconData icon, String label, VoidCallback onTap) {
    return ElevatedButton(
      onPressed: onTap,
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 2,
        padding: const EdgeInsets.symmetric(vertical: 18),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 28, color: Colors.blue.shade700),
          const SizedBox(height: 10),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(fontWeight: FontWeight.w600),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(
    String value,
    String label,
    IconData icon,
    Color color,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: color.withAlpha((0.25 * 255).round()),
            blurRadius: 18,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withAlpha((0.2 * 255).round()),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(icon, color: Colors.white, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  value,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  label,
                  style: const TextStyle(color: Colors.white70, fontSize: 13),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(
    String title,
    String subtitle,
    IconData icon,
    VoidCallback onTap,
  ) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: ListTile(
        leading: Icon(icon, color: Colors.blue.shade700),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.arrow_forward_ios, size: 16),
        onTap: onTap,
      ),
    );
  }
}
