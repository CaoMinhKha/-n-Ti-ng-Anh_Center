import 'package:flutter/material.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../../duong_dan/duong_dan.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  String _name = 'Học viên';
  String _role = 'Student';
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadUserInfo();
  }

  Future<void> _loadUserInfo() async {
    final name = await UserSession.getUserName();
    final role = await UserSession.getUserRole();
    setState(() {
      _name = name ?? 'Học viên';
      _role = role ?? 'Học viên';
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: const Text('Hồ sơ cá nhân'),
        actions: [
          IconButton(icon: const Icon(Icons.edit_note_rounded), onPressed: () {}),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  _buildHeader(),
                  const SizedBox(height: 24),
                  _buildStatsRow(),
                  const SizedBox(height: 32),
                  _buildMenuSection(),
                ],
              ),
            ),
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.only(bottom: 30),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(40)),
      ),
      child: Column(
        children: [
          const CircleAvatar(
            radius: 60,
            backgroundColor: Color(0xFF4B8AF7),
            child: Icon(Icons.person, size: 70, color: Colors.white),
          ),
          const SizedBox(height: 16),
          Text(_name, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(_role.toUpperCase(), style: TextStyle(color: Colors.grey.shade500, fontWeight: FontWeight.w600, letterSpacing: 1.2, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildStatsRow() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Row(
        children: [
          _statItem('12', 'Khóa học', Colors.blue),
          _statItem('8.5', 'Điểm TB', Colors.orange),
          _statItem('95%', 'Chuyên cần', Colors.green),
        ],
      ),
    );
  }

  Widget _statItem(String value, String label, Color color) {
    return Expanded(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 6),
        padding: const EdgeInsets.symmetric(vertical: 20),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Column(
          children: [
            Text(value, style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: color)),
            const SizedBox(height: 4),
            Text(label, style: TextStyle(fontSize: 12, color: color.withOpacity(0.8))),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuSection() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(30),
      ),
      child: Column(
        children: [
          _menuTile(Icons.assignment_ind_outlined, 'Thông tin cá nhân', () {}),
          _menuTile(Icons.history_rounded, 'Lịch sử học tập', () => Navigator.pushNamed(context, AppRoutes.progress)),
          _menuTile(Icons.notifications_none_rounded, 'Cài đặt thông báo', () {}),
          _menuTile(Icons.shield_outlined, 'Bảo mật', () {}),
          const Divider(indent: 20, endIndent: 20),
          _menuTile(Icons.logout_rounded, 'Đăng xuất', () async {
            await UserSession.logout();
            if (mounted) Navigator.pushReplacementNamed(context, AppRoutes.login);
          }, isDanger: true),
        ],
      ),
    );
  }

  Widget _menuTile(IconData icon, String title, VoidCallback onTap, {bool isDanger = false}) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: isDanger ? Colors.red.shade50 : Colors.grey.shade50,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: isDanger ? Colors.red : Colors.grey.shade700, size: 22),
      ),
      title: Text(title, style: TextStyle(fontWeight: FontWeight.w600, color: isDanger ? Colors.red : Colors.black87)),
      trailing: const Icon(Icons.chevron_right_rounded, color: Colors.grey),
    );
  }
}
