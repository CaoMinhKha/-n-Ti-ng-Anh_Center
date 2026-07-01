import 'dart:convert';
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class AuthService {
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    // Đúng format endpoint: /api/index.php?request=dangnhap
    final response = await http.post(
      Uri.parse("${ApiConstants.baseUrl}/index.php?request=dangnhap"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "username": username,
        "password": password,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception(
          "Lỗi máy chủ: ${response.statusCode}. Vui lòng kiểm tra API.");
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
