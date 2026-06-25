import 'package:flutter/material.dart';
import '../course/course_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  void goTo(BuildContext context, Widget screen) {
    Navigator.pop(context); // đóng drawer trước
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => screen),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Trung Tâm Anh Ngữ"),
        centerTitle: true,
      ),

      // ================= DRAWER =================
      drawer: Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const UserAccountsDrawerHeader(
              accountName: Text("Cao Minh Kha"),
              accountEmail: Text("kha@gmail.com"),
              currentAccountPicture: CircleAvatar(
                child: Icon(Icons.person, size: 40),
              ),
            ),

            _drawerItem(
              context,
              icon: Icons.menu_book,
              title: "Khóa học",
              onTap: () => goTo(context, const CourseScreen()),
            ),

            _drawerItem(
              context,
              icon: Icons.app_registration,
              title: "Đăng ký khóa học",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.class_,
              title: "Lớp học",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.school,
              title: "Học bài",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.quiz,
              title: "Bài kiểm tra",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.bar_chart,
              title: "Kết quả",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.trending_up,
              title: "Tiến độ học tập",
              onTap: () {},
            ),

            _drawerItem(
              context,
              icon: Icons.person,
              title: "Hồ sơ",
              onTap: () {},
            ),

            const Divider(),

            _drawerItem(
              context,
              icon: Icons.logout,
              title: "Đăng xuất",
              onTap: () {
                Navigator.popUntil(context, (route) => route.isFirst);
              },
            ),
          ],
        ),
      ),

      // ================= BODY =================
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // CARD USER
            Card(
              elevation: 5,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: const [
                    CircleAvatar(
                      radius: 35,
                      child: Icon(Icons.person, size: 35),
                    ),
                    SizedBox(width: 15),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text("Xin chào",
                            style: TextStyle(fontSize: 16)),
                        Text(
                          "Cao Minh Kha",
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // GRID MENU
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 10,
                mainAxisSpacing: 10,
                children: [
                  _menuCard(context, Icons.menu_book, "Khóa học",
                      const CourseScreen()),

                  _menuCard(context, Icons.school, "Học bài", null),
                  _menuCard(context, Icons.quiz, "Kiểm tra", null),
                  _menuCard(context, Icons.bar_chart, "Kết quả", null),
                  _menuCard(context, Icons.trending_up, "Tiến độ", null),
                  _menuCard(context, Icons.person, "Hồ sơ", null),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ================= DRAWER ITEM =================
  Widget _drawerItem(
    BuildContext context, {
    required IconData icon,
    required String title,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon),
      title: Text(title),
      onTap: onTap,
    );
  }

  // ================= MENU CARD =================
  Widget _menuCard(
    BuildContext context,
    IconData icon,
    String title,
    Widget? screen,
  ) {
    return InkWell(
      onTap: () {
        if (screen != null) {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => screen),
          );
        }
      },
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 50, color: Colors.blue),
            const SizedBox(height: 10),
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}