import 'dart:convert';
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class RegisterService {

  static Future<Map<String, dynamic>> register({
    required String username,
    required String password,
    required String hoten,
    required String email,
  }) async {
    final response = await http.post(
      Uri.parse("${ApiConstants.baseUrl}/hocvien"),
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonEncode({
        "TenDangNhap": username,
        "MatKhau": password,
        "HoTen": hoten,
        "Email": email,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception(
          "Lỗi máy chủ: ${response.statusCode}. Vui lòng kiểm tra API.");
    }

    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
