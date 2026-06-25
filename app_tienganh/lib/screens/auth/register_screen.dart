import 'package:flutter/material.dart';
import '../../services/register_service.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() =>
      _RegisterScreenState();
}

class _RegisterScreenState
    extends State<RegisterScreen> {

  final username =
      TextEditingController();

  final password =
      TextEditingController();

  final hoten =
      TextEditingController();

  final email =
      TextEditingController();

  bool isLoading = false;

  bool isObscure = true;

  Future<void> register() async {

    setState(() {
      isLoading = true;
    });

    try {

      final result =
          await RegisterService.register(

        username:
            username.text.trim(),

        password:
            password.text.trim(),

        hoten:
            hoten.text.trim(),

        email:
            email.text.trim(),
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context)
          .showSnackBar(

        SnackBar(
          content: Text(
            result["message"] ??
                "Có lỗi xảy ra",
          ),
        ),
      );

      if (result["status"] ==
          "success") {

        Future.delayed(
          const Duration(seconds: 1),
          () {

            if (mounted) {
              Navigator.pop(context);
            }
          },
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

                      color:
                          Colors.black12,

                      blurRadius: 10,

                      offset:
                          const Offset(
                              0, 5),
                    ),
                  ],
                ),

                child: Column(

                  children: [

                    const Icon(
                      Icons.app_registration,
                      size: 80,
                      color:
                          Color(0xff4A90E2),
                    ),

                    const SizedBox(
                        height: 10),

                    const Text(

                      "ĐĂNG KÝ\nHỌC VIÊN",

                      textAlign:
                          TextAlign.center,

                      style: TextStyle(

                        fontSize: 24,

                        fontWeight:
                            FontWeight.bold,
                      ),
                    ),

                    const SizedBox(
                        height: 20),

                    TextField(

                      controller: hoten,

                      decoration:
                          InputDecoration(

                        labelText:
                            "Họ và tên",

                        prefixIcon:
                            const Icon(
                                Icons.badge),

                        border:
                            OutlineInputBorder(

                          borderRadius:
                              BorderRadius.circular(
                                  15),
                        ),
                      ),
                    ),

                    const SizedBox(
                        height: 12),

                    TextField(

                      controller:
                          email,

                      keyboardType:
                          TextInputType
                              .emailAddress,

                      decoration:
                          InputDecoration(

                        labelText:
                            "Email",

                        prefixIcon:
                            const Icon(
                                Icons.email),

                        border:
                            OutlineInputBorder(

                          borderRadius:
                              BorderRadius.circular(
                                  15),
                        ),
                      ),
                    ),

                    const SizedBox(
                        height: 12),

                    TextField(

                      controller:
                          username,

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
                        height: 12),

                    TextField(

                      controller:
                          password,

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
                                : register,

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

                                    "ĐĂNG KÝ",

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

                        Navigator.pop(
                            context);
                      },

                      child: const Text(
                        "Đã có tài khoản? Đăng nhập",
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