import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {

  static const String baseUrl =
      "http://localhost/admin_ENGLISHcenter/api";

  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {

    final response = await http.post(

      Uri.parse(
        "$baseUrl/auth.php?action=login",
      ),

      headers: {
        "Content-Type": "application/json",
      },

      body: jsonEncode({

        "username": username,

        "password": password,
      }),
    );

    return jsonDecode(
      response.body,
    );
  }
}