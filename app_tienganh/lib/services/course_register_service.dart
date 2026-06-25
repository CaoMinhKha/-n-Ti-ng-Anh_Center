import 'dart:convert';
import 'package:http/http.dart' as http;

class CourseRegisterService {

  static const String baseUrl =
      "http://192.168.1.4/admin_ENGLISHcenter/api";

  static Future<String> registerCourse({
    required int maHocVien,
    required int maKhoaHoc,
  }) async {

    try {
      final response = await http.post(
        Uri.parse("$baseUrl/register_course.php"),
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({
          "MaHocVien": maHocVien,
          "MaKhoaHoc": maKhoaHoc,
        }),
      );

      final json = jsonDecode(response.body);

      return json["status"];

    } catch (e) {
      return "error";
    }
  }
}