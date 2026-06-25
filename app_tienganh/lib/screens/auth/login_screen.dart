import 'package:flutter/material.dart';
import '../../services/auth_service.dart';
import '../home/home_screen.dart';
import 'register_screen.dart';

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

      if (result["status"] ==
          "success") {

        Navigator.pushReplacement(

          context,

          MaterialPageRoute(
            builder: (_) =>
                const HomeScreen(),
          ),
        );

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