import 'package:flutter/material.dart';

class AppDrawer
    extends StatelessWidget {

  const AppDrawer({super.key});

  @override
  Widget build(BuildContext context) {

    return Drawer(

      child: ListView(

        children: [

          const UserAccountsDrawerHeader(

            accountName:
            Text("Cao Minh Kha"),

            accountEmail:
            Text("kha@gmail.com"),
          ),

          ListTile(
            leading:
            const Icon(Icons.school),
            title:
            const Text("Khóa học"),
            onTap: () {},
          ),

          ListTile(
            leading:
            const Icon(Icons.book),
            title:
            const Text("Bài học"),
            onTap: () {},
          ),

          ListTile(
            leading:
            const Icon(Icons.quiz),
            title:
            const Text("Kiểm tra"),
            onTap: () {},
          ),

          ListTile(
            leading:
            const Icon(Icons.bar_chart),
            title:
            const Text("Kết quả"),
            onTap: () {},
          ),

          ListTile(
            leading:
            const Icon(Icons.person),
            title:
            const Text("Hồ sơ"),
            onTap: () {},
          ),

          const Divider(),

          ListTile(
            leading:
            const Icon(Icons.logout),
            title:
            const Text("Đăng xuất"),

            onTap: () {

              Navigator.pushNamedAndRemoveUntil(
                context,
                '/',
                    (route) => false,
              );
            },
          ),
        ],
      ),
    );
  }
}