import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../thanh_phan/thanh_menu.dart';
import '../admin/giao_dien_giao_vien_admin.dart';
import '../admin/giao_dien_hoc_vien_admin.dart';
import '../admin/giao_dien_quan_tri_admin.dart';
import '../admin/giao_dien_khoa_hoc_admin.dart';
import '../admin/giao_dien_lop_admin.dart';

class GiaoDienQuanTriVien extends StatefulWidget {
  const GiaoDienQuanTriVien({super.key});

  @override
  State<GiaoDienQuanTriVien> createState() => _GiaoDienQuanTriVienState();
}

class _GiaoDienQuanTriVienState extends State<GiaoDienQuanTriVien> {
  String userName = 'Admin';
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
    final pages = [_buildDashboard(), _buildManagement(), _buildProfile()];

    return Scaffold(
      drawer: const ThanhMenu(),
      appBar: AppBar(
        title: const Text('Giao diện quản trị viên'),
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
          BottomNavigationBarItem(
            icon: Icon(Icons.dashboard),
            label: 'Tổng quan',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.manage_accounts),
            label: 'Quản lý',
          ),
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
                    Icons.admin_panel_settings,
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
                        'Quản lý trung tâm và theo dõi báo cáo nhanh.',
                        style: TextStyle(color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Wrap(
            spacing: 12,
            runSpacing: 12,
            children: [
              _buildSummaryCard(
                '12',
                'Khóa học',
                Icons.menu_book,
                const Color(0xFF34B1FF),
              ),
              _buildSummaryCard(
                '38',
                'Giáo viên',
                Icons.school,
                const Color(0xFF34D399),
              ),
              _buildSummaryCard(
                '120',
                'Học viên',
                Icons.group,
                const Color(0xFFF59E0B),
              ),
              _buildSummaryCard(
                '8',
                'Lớp học',
                Icons.class_,
                const Color(0xFFEF4444),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Chức năng chính',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 14,
            runSpacing: 14,
            children: [
              _buildQuickButton(
                Icons.person,
                'Tài khoản',
                () => _navigateTo(context, const AdminManagementScreen()),
              ),
              _buildQuickButton(
                Icons.school,
                'Giáo viên',
                () => _navigateTo(context, const AdminTeacherScreen()),
              ),
              _buildQuickButton(
                Icons.group,
                'Học viên',
                () => _navigateTo(context, const AdminStudentScreen()),
              ),
              _buildQuickButton(
                Icons.menu_book,
                'Khóa học',
                () => _navigateTo(context, const AdminCourseScreen()),
              ),
            ],
          ),
          const SizedBox(height: 24),
          const Text(
            'Báo cáo nhanh',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildStatCard('12', 'Khóa học')),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('38', 'Giáo viên')),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(child: _buildStatCard('120', 'Học viên')),
              const SizedBox(width: 12),
              Expanded(child: _buildStatCard('8', 'Lớp học')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildManagement() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Quản lý trung tâm',
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          _buildInfoCard(
            'Quản lý giáo viên',
            'Xem danh sách, thêm, sửa giáo viên',
            Icons.school,
            () => _navigateTo(context, const AdminTeacherScreen()),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Quản lý học viên',
            'Xem hồ sơ và tiến độ học viên',
            Icons.group,
            () => _navigateTo(context, const AdminStudentScreen()),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Quản lý khóa học',
            'Quản lý nội dung và lịch học',
            Icons.menu_book,
            () => _navigateTo(context, const AdminCourseScreen()),
          ),
          const SizedBox(height: 12),
          _buildInfoCard(
            'Quản trị toàn diện',
            'Quản lý người dùng, danh mục, lớp học và đăng ký',
            Icons.bar_chart,
            () => _navigateTo(context, const AdminManagementScreen()),
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
                  const Text('Vai trò: Quản trị viên'),
                  const SizedBox(height: 16),
                  const Text(
                    'Quản lý người dùng, khóa học và báo cáo trung tâm.',
                  ),
                  const SizedBox(height: 20),
                  ElevatedButton.icon(
                    onPressed: () =>
                        _navigateTo(context, const AdminManagementScreen()),
                    icon: const Icon(Icons.manage_accounts),
                    label: const Text('Quản trị toàn diện'),
                    style: ElevatedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _navigateTo(context, const AdminStudentScreen()),
                    icon: const Icon(Icons.group),
                    label: const Text('Quản lý học viên'),
                    style: OutlinedButton.styleFrom(
                      minimumSize: const Size.fromHeight(48),
                    ),
                  ),
                  const SizedBox(height: 12),
                  OutlinedButton.icon(
                    onPressed: () =>
                        _navigateTo(context, const AdminClassScreen()),
                    icon: const Icon(Icons.class_),
                    label: const Text('Quản lý lớp học'),
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
    return SizedBox(
      width: 160,
      child: ElevatedButton(
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

  Widget _buildStatCard(String value, String label) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: Colors.black54)),
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
