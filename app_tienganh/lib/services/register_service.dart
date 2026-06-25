import 'dart:convert';
import 'package:http/http.dart' as http;

class RegisterService {

  static const String baseUrl =
      "http://localhost/admin_ENGLISHcenter/api";

  static Future<Map<String,dynamic>>
      register({

    required String username,
    required String password,
    required String hoten,
    required String email,

  }) async {

    final response = await http.post(

      Uri.parse(
        "$baseUrl/auth.php?action=register",
      ),

      headers: {
        "Content-Type":"application/json",
      },

      body: jsonEncode({

        "username": username,

        "password": password,

        "hoten": hoten,

        "email": email,

      }),
    );

    return jsonDecode(
      response.body,
    );
  }
}