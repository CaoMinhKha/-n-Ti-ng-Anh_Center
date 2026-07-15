import 'package:flutter/material.dart';
import '../duong_dan/duong_dan.dart';
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';

class ThanhMenu extends StatefulWidget {
  const ThanhMenu({super.key});

  @override
  State<ThanhMenu> createState() => _ThanhMenuState();
}

class _ThanhMenuState extends State<ThanhMenu> {
  String? role;
  String name = 'Người dùng';

  @override
  void initState() {
    super.initState();
    _loadInfo();
  }

  Future<void> _loadInfo() async {
    final r = await UserSession.getUserRole();
    final n = await UserSession.getUserName();
    setState(() {
      role = r;
      name = n ?? 'Người dùng';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: Column(
        children: [
          UserAccountsDrawerHeader(
            accountName: Text(name, style: const TextStyle(fontWeight: FontWeight.bold)),
            accountEmail: Text(role ?? ''),
            currentAccountPicture: const CircleAvatar(
              backgroundColor: Colors.white,
              child: Icon(Icons.person, size: 40, color: Color(0xFF2563EB)),
            ),
            decoration: const BoxDecoration(
              color: Color(0xFF2563EB),
            ),
          ),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: _buildMenuItems(context),
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Đăng xuất', style: TextStyle(color: Colors.red)),
            onTap: () async {
              await UserSession.logout();
              if (mounted) Navigator.pushReplacementNamed(context, AppRoutes.login);
            },
          ),
          const SizedBox(height: 20),
        ],
      ),
    );
  }

  List<Widget> _buildMenuItems(BuildContext context) {
    if (role == 'ADMIN') {
      return [
        _menuItem(context, Icons.dashboard, 'Dashboard', AppRoutes.adminHome),
        _sectionTitle('Quản lý tài khoản'),
        _menuItem(context, Icons.admin_panel_settings, 'Quản trị viên', AppRoutes.adminHome),
        _menuItem(context, Icons.school, 'Giáo viên', AppRoutes.adminHome),
        _menuItem(context, Icons.group, 'Học viên', AppRoutes.adminHome),
        _sectionTitle('Quản lý đào tạo'),
        _menuItem(context, Icons.category, 'Danh mục', AppRoutes.adminHome),
        _menuItem(context, Icons.book, 'Khóa học', AppRoutes.adminHome),
        _menuItem(context, Icons.class_, 'Lớp học', AppRoutes.adminHome),
        _sectionTitle('Nội dung học'),
        _menuItem(context, Icons.quiz, 'Câu hỏi & Đáp án', AppRoutes.adminHome),
        _menuItem(context, Icons.assignment, 'Bài kiểm tra', AppRoutes.adminHome),
        _sectionTitle('Tài chính'),
        _menuItem(context, Icons.payments, 'Học phí & Doanh thu', AppRoutes.adminHome),
      ];
    } else if (role == 'GIAO_VIEN') {
      return [
        _menuItem(context, Icons.dashboard, 'Dashboard', AppRoutes.teacherHome),
        _menuItem(context, Icons.class_, 'Lớp học của tôi', AppRoutes.teacherHome),
        _menuItem(context, Icons.calendar_month, 'Lịch dạy', AppRoutes.teacherHome),
        _menuItem(context, Icons.book, 'Bài học', AppRoutes.teacherHome),
        _menuItem(context, Icons.assignment, 'Bài kiểm tra', AppRoutes.teacherHome),
        _menuItem(context, Icons.groups, 'Học viên', AppRoutes.teacherHome),
        _menuItem(context, Icons.bar_chart, 'Tiến độ học', AppRoutes.teacherHome),
        _menuItem(context, Icons.person, 'Hồ sơ', AppRoutes.profile),
      ];
    } else {
      return [
        _menuItem(context, Icons.home, 'Trang chủ', AppRoutes.studentHome),
        _menuItem(context, Icons.book, 'Khóa học', AppRoutes.studentHome),
        _menuItem(context, Icons.assignment_turned_in, 'Kiểm tra', AppRoutes.progress),
        _menuItem(context, Icons.calendar_month, 'Lịch học', AppRoutes.schedule),
        _menuItem(context, Icons.notifications, 'Thông báo', AppRoutes.studentHome),
        _menuItem(context, Icons.person, 'Cá nhân', AppRoutes.profile),
      ];
    }
  }

  Widget _sectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
      child: Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey.shade600)),
    );
  }

  Widget _menuItem(BuildContext context, IconData icon, String title, String route) {
    return ListTile(
      leading: Icon(icon, color: const Color(0xFF1E293B)),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w500)),
      onTap: () => Navigator.pushReplacementNamed(context, route),
    );
  }
}
