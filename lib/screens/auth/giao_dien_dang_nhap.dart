import 'package:flutter/material.dart';
import '../../duong_dan/duong_dan.dart';
import '../../dich_vu/dich_vu_xac_thuc.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';
import 'giao_dien_dang_ky.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() =>
      _LoginScreenState();
}

class _LoginScreenState
    extends State<LoginScreen> {

  final usernameController =
      TextEditingController();

  final passwordController =
      TextEditingController();

  bool isLoading = false;

  bool isObscure = true;

  Future<void> login() async {

    setState(() {
      isLoading = true;
    });

    try {

      final result =
          await AuthService.login(

        username:
            usernameController.text.trim(),

        password:
            passwordController.text.trim(),
      );

      if (!mounted) return;

      if (result["status"] == true || result["status"] == "success") {
        final data = result["data"] as Map<String, dynamic>? ?? {};
        final rawRole = data["role"] ??
            data["PhanQuyen"] ??
            data["roleName"] ??
            data["permission"] ??
            data["type"];
        final role = _normalizeRole(rawRole);
        final rawUserId = data["MaHocVien"] ??
            data["MaGiaoVien"] ??
            data["MaQuanTriVien"] ??
            data["id"] ??
            data["userId"];
        final userName = data["HoTen"] ??
            data["TenDangNhap"] ??
            data["username"] ??
            data["name"];

        if (role == null) {
          ScaffoldMessenger.of(context)
              .showSnackBar(
            const SnackBar(
              content: Text(
                "Không xác định vai trò. Vui lòng kiểm tra API.",
              ),
            ),
          );
          setState(() {
            isLoading = false;
          });
          return;
        }

        if (rawUserId != null) {
          final userId = int.tryParse(rawUserId.toString());
          if (userId != null) {
            await UserSession.saveUser(userId);
            await UserSession.saveUserId(userId);
          }
        }

        if (userName != null) {
          await UserSession.saveUserName(userName.toString());
        }

        if (result['token'] != null) {
          await UserSession.saveToken(result['token'].toString());
        }

        await UserSession.saveUserRole(role);

        if (!mounted) return;

        String destination;
        if (role == "admin") {
          destination = AppRoutes.adminHome;
        } else if (role == "teacher") {
          destination = AppRoutes.teacherHome;
        } else if (role == "student") {
          destination = AppRoutes.studentHome;
        } else {
          destination = AppRoutes.home;
        }

        Navigator.pushReplacementNamed(context, destination);

      } else {

        ScaffoldMessenger.of(context)
            .showSnackBar(

          SnackBar(
            content: Text(
              result["message"] ??
                  "Đăng nhập thất bại",
            ),
          ),
        );
      }

    } catch (e) {

      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(

        SnackBar(
          content: Text(
            "Lỗi: $e",
          ),
        ),
      );
    }

    if (mounted) {
      setState(() {
        isLoading = false;
      });
    }
  }

  String? _normalizeRole(dynamic rawRole) {
    if (rawRole == null) return null;
    final roleText = rawRole.toString().toLowerCase().trim();
    if (roleText.contains('admin') || roleText.contains('quản trị') || roleText == '1') {
      return 'admin';
    }
    if (roleText.contains('gv') || roleText.contains('giáo viên') || roleText.contains('teacher') || roleText == '2') {
      return 'teacher';
    }
    if (roleText.contains('hv') || roleText.contains('học viên') || roleText.contains('student') || roleText == '3') {
      return 'student';
    }
    return null;
  }

  @override
  Widget build(
      BuildContext context) {

    return Scaffold(

      body: Container(

        width: double.infinity,

        decoration:
            const BoxDecoration(

          gradient:
              LinearGradient(

            begin:
                Alignment.topCenter,

            end:
                Alignment.bottomCenter,

            colors: [

              Color(0xff4A90E2),

              Color(0xff357ABD),
            ],
          ),
        ),

        child: SafeArea(

          child: Center(

            child:
                SingleChildScrollView(

              child: Container(

                margin:
                    const EdgeInsets.all(
                        20),

                padding:
                    const EdgeInsets.all(
                        25),

                decoration:
                    BoxDecoration(

                  color: Colors.white,

                  borderRadius:
                      BorderRadius.circular(
                          25),

                  boxShadow: [

                    BoxShadow(

                      color: Colors.black12,

                      blurRadius: 10,

                      offset:
                          const Offset(
                              0, 5),
                    ),
                  ],
                ),

                child: Column(

                  mainAxisSize:
                      MainAxisSize.min,

                  children: [

                    const Icon(

                      Icons.school,

                      size: 90,

                      color:
                          Color(0xff4A90E2),
                    ),

                    const SizedBox(
                        height: 10),

                    const Text(

                      "TRUNG TÂM\nANH NGỮ",

                      textAlign:
                          TextAlign.center,

                      style: TextStyle(

                        fontSize: 24,

                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                        height: 30),

                    TextField(

                      controller:
                          usernameController,

                      decoration:
                          InputDecoration(

                        labelText:
                            "Tên đăng nhập",

                        prefixIcon:
                            const Icon(
                                Icons.person),

                        border:
                            OutlineInputBorder(

                          borderRadius:
                              BorderRadius.circular(
                                  15),
                        ),
                      ),
                    ),

                    const SizedBox(
                        height: 15),

                    TextField(

                      controller:
                          passwordController,

                      obscureText:
                          isObscure,

                      decoration:
                          InputDecoration(

                        labelText:
                            "Mật khẩu",

                        prefixIcon:
                            const Icon(
                                Icons.lock),

                        suffixIcon:
                            IconButton(

                          icon: Icon(

                            isObscure

                                ? Icons.visibility

                                : Icons.visibility_off,
                          ),

                          onPressed: () {

                            setState(() {

                              isObscure =
                                  !isObscure;
                            });
                          },
                        ),

                        border:
                            OutlineInputBorder(

                          borderRadius:
                              BorderRadius.circular(
                                  15),
                        ),
                      ),
                    ),

                    const SizedBox(
                        height: 25),

                    SizedBox(

                      width:
                          double.infinity,

                      height: 50,

                      child:
                          ElevatedButton(

                        onPressed:
                            isLoading
                                ? null
                                : login,

                        style:
                            ElevatedButton.styleFrom(

                          shape:
                              RoundedRectangleBorder(

                            borderRadius:
                                BorderRadius.circular(
                                    15),
                          ),
                        ),

                        child:
                            isLoading

                                ? const SizedBox(

                                    width: 25,

                                    height: 25,

                                    child:
                                        CircularProgressIndicator(
                                      color:
                                          Colors.white,
                                      strokeWidth:
                                          3,
                                    ),
                                  )

                                : const Text(

                                    "ĐĂNG NHẬP",

                                    style:
                                        TextStyle(
                                      fontSize:
                                          18,
                                    ),
                                  ),
                      ),
                    ),

                    const SizedBox(
                        height: 15),

                    TextButton(

                      onPressed: () {

                        Navigator.push(

                          context,

                          MaterialPageRoute(

                            builder: (_) =>
                                const RegisterScreen(),
                          ),
                        );
                      },

                      child: const Text(
                        "Chưa có tài khoản? Đăng ký",
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}