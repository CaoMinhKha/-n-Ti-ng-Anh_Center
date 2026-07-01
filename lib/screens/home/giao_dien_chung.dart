import 'package:flutter/material.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../duong_dan/duong_dan.dart';
import '../course/giao_dien_khoa_hoc.dart';

class GiaoDienChung extends StatefulWidget {
  const GiaoDienChung({super.key});

  @override
  State<GiaoDienChung> createState() => _GiaoDienChungState();
}

class _GiaoDienChungState extends State<GiaoDienChung> {
  String userName = 'Người dùng';
  String? _userRole;
  int _currentIndex = 0;

  @override
  void initState() {
    super.initState();
    _loadSessionData();
  }

  Future<void> _loadSessionData() async {
    final name = await UserSession.getUserName();
    final role = await UserSession.getUserRole();
    setState(() {
      userName = name ?? 'Người dùng';
      _userRole = role;
    });
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final pages = [_buildDashboard(), _buildCourses(), _buildProfile()];

    return Scaffold(
      appBar: AppBar(
        title: const Text('Trung tâm Anh ngữ'),
        centerTitle: true,
        backgroundColor: Colors.blue.shade600,
      ),
      body: pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: _onTabSelected,
        selectedItemColor: Colors.blue.shade700,
        unselectedItemColor: Colors.black54,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
          BottomNavigationBarItem(icon: Icon(Icons.menu_book), label: 'Khóa học'),
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
                  child: Icon(Icons.school, size: 36, color: Colors.blue.shade700),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Xin chào', style: TextStyle(color: Colors.black54, fontSize: 16)),
                      const SizedBox(height: 8),
                      Text(userName, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 8),
                      const Text('Bắt đầu học ngay với các chức năng bên dưới.', style: TextStyle(color: Colors.black54)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          const Text('Chức năng chính', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 14),
          GridView.count(
            crossAxisCount: 2,
            crossAxisSpacing: 14,
            mainAxisSpacing: 14,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              _buildQuickButton(Icons.menu_book, 'Khóa học', () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CourseScreen()))),
              _buildQuickButton(Icons.app_registration, 'Đăng ký', () => Navigator.pushNamed(context, AppRoutes.studentHome)),
              if (_userRole == 'student')
                _buildQuickButton(Icons.school, 'Học bài', () => Navigator.pushNamed(context, AppRoutes.lessonDragMatch)),
              _buildQuickButton(Icons.bar_chart, 'Tiến độ', () => Navigator.pushNamed(context, AppRoutes.progress)),
            ],
          ),
          const SizedBox(height: 24),
          if (_userRole == 'student') ...[
            const Text('Gợi ý hôm nay', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
              child: ListTile(
                contentPadding: const EdgeInsets.all(16),
                leading: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(color: Colors.blue.shade100, borderRadius: BorderRadius.circular(14)),
                  child: const Icon(Icons.play_circle_fill, color: Colors.blue, size: 32),
                ),
                title: const Text('Bài 1B.3: Past continuous'),
                subtitle: const Text('Luyện tập kéo đáp án và ghép câu theo dạng trực quan.'),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16),
                onTap: () => Navigator.pushNamed(context, AppRoutes.lessonDragMatch),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCourses() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Quản lý khóa học', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _buildInfoTile('Danh sách khóa học', 'Xem tất cả khóa học hiện có', Icons.menu_book, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const CourseScreen()))),
          const SizedBox(height: 12),
          _buildInfoTile('Đăng ký khóa học', 'Đăng ký khóa học mới', Icons.app_registration, () => Navigator.pushNamed(context, AppRoutes.studentHome)),
          const SizedBox(height: 12),
          _buildInfoTile('Chi tiết khóa học', 'Xem thông tin chi tiết khóa học', Icons.info, () => Navigator.pushNamed(context, AppRoutes.courseDetail)),
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
          const Text('Hồ sơ', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(userName, style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  const Text('Xem và quản lý hồ sơ cá nhân cùng tiến độ học tập.'),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, AppRoutes.profile),
                    icon: const Icon(Icons.person),
                    label: const Text('Xem hồ sơ'),
                    style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () => Navigator.pushNamed(context, AppRoutes.progress),
                    icon: const Icon(Icons.bar_chart),
                    label: const Text('Tiến độ học tập'),
                    style: OutlinedButton.styleFrom(minimumSize: const Size.fromHeight(48)),
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
          Text(label, textAlign: TextAlign.center, style: const TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildInfoTile(String title, String subtitle, IconData icon, VoidCallback onTap) {
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
