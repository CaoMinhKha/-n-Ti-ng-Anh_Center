import 'dart:convert';
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class CourseRegisterService {
  static Future<String> registerCourse({
    required int maHocVien,
    required int maKhoaHoc,
  }) async {
    try {
      final response = await http.post(
        Uri.parse("${ApiConstants.baseUrl}/dangkylop"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "MaHocVien": maHocVien,
          "MaLop": maKhoaHoc,
        }),
      );

      final json = jsonDecode(response.body);

      return json["status"];

    } catch (e) {
      return "error";
    }
  }
}
