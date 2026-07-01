import 'package:flutter/material.dart';
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';
import '../duong_dan/duong_dan.dart';

class ThanhMenu extends StatefulWidget {
  const ThanhMenu({super.key});

  @override
  State<ThanhMenu> createState() => _ThanhMenuState();
}

class _ThanhMenuState extends State<ThanhMenu> {
  String userName = "Người dùng";

  @override
  void initState() {
    super.initState();
    _loadUserName();
  }

  Future<void> _loadUserName() async {
    final name = await UserSession.getUserName();
    setState(() {
      userName = name ?? "Người dùng";
    });
  }

  String _homeRouteForRole(String? role) {
    if (role == 'admin') return AppRoutes.adminHome;
    if (role == 'teacher') return AppRoutes.teacherHome;
    if (role == 'student') return AppRoutes.studentHome;
    return AppRoutes.home;
  }

  @override
  Widget build(BuildContext context) {
    return Drawer(
      child: FutureBuilder<String?>(
        future: UserSession.getUserRole(),
        builder: (context, snapshot) {
          final role = snapshot.data;
          final homeRoute = _homeRouteForRole(role);

          return ListView(
            padding: EdgeInsets.zero,
            children: [
              // ============ HEADER =============
              UserAccountsDrawerHeader(
                currentAccountPicture: CircleAvatar(
                  backgroundColor: Colors.blue.shade100,
                  child: const Icon(
                    Icons.person,
                    size: 40,
                    color: Colors.blue,
                  ),
                ),
                accountName: Text(
                  userName,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                accountEmail: const Text("app_english_center"),
                decoration: BoxDecoration(
                  color: Colors.blue.shade600,
                ),
              ),

              // ============ MENU ITEMS =============
              ListTile(
                leading: const Icon(Icons.dashboard, color: Colors.blue),
                title: const Text("Trang chủ"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, homeRoute);
                },
              ),

              if (role == 'student')
                ListTile(
                  leading: const Icon(Icons.app_registration, color: Colors.green),
                  title: const Text("Đăng ký khóa học"),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.studentHome);
                  },
                ),

              ListTile(
                leading: const Icon(Icons.class_, color: Colors.orange),
                title: const Text("Lớp học"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, homeRoute);
                },
              ),

              if (role == 'student')
                ListTile(
                  leading: const Icon(Icons.book, color: Colors.purple),
                  title: const Text("Bài học"),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, AppRoutes.lessonDragMatch);
                  },
                ),

              if (role == 'student' || role == 'teacher')
                ListTile(
                  leading: const Icon(Icons.quiz, color: Colors.red),
                  title: const Text("Bài kiểm tra"),
                  onTap: () {
                    Navigator.pop(context);
                    Navigator.pushNamed(context, homeRoute);
                  },
                ),

              ListTile(
                leading: const Icon(Icons.bar_chart, color: Colors.teal),
                title: const Text("Kết quả"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, AppRoutes.progress);
                },
              ),

              ListTile(
                leading: const Icon(Icons.trending_up, color: Colors.indigo),
                title: const Text("Tiến độ học tập"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, AppRoutes.progress);
                },
              ),

              ListTile(
                leading: const Icon(Icons.person, color: Colors.cyan),
                title: const Text("Hồ sơ"),
                onTap: () {
                  Navigator.pop(context);
                  Navigator.pushNamed(context, AppRoutes.profile);
                },
              ),

              const Divider(thickness: 2),

              // ============ LOGOUT =============
              ListTile(
                leading: const Icon(Icons.logout, color: Colors.red),
                title: const Text(
                  "Đăng xuất",
                  style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold),
                ),
                onTap: () async {
                  await UserSession.logout();
                  if (!context.mounted) return;
                  Navigator.pushNamedAndRemoveUntil(
                    context,
                    AppRoutes.login,
                    (route) => false,
                  );
                },
              ),
            ],
          );
        },
      ),
    );
  }
}
