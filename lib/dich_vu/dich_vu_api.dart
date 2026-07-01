import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {

  static const String baseUrl =
      "http://192.168.1.4/admin_ENGLISHcenter/app/api";

  // Lấy danh sách khóa học
  static Future<List<dynamic>> getCourses() async {

    final response = await http.get(
      Uri.parse(
        "$baseUrl/get_courses.php",
      ),
    );

    if (response.statusCode == 200) {

      return jsonDecode(
        response.body,
      );
    }

    return [];
  }

  // Đăng nhập
  static Future<Map<String, dynamic>>
  login(
      String username,
      String password,
      ) async {

    final response = await http.post(

      Uri.parse(
        "$baseUrl/login.php",
      ),

      body: {
        "username": username,
        "password": password,
      },
    );

    return jsonDecode(
      response.body,
    );
  }

  // Đăng ký
  static Future<Map<String, dynamic>>
  register({
    required String hoTen,
    required String email,
    required String username,
    required String password,
  }) async {

    final response = await http.post(

      Uri.parse(
        "$baseUrl/register.php",
      ),

      body: {

        "HoTen": hoTen,

        "Email": email,

        "TenDangNhap":
        username,

        "MatKhau":
        password,
      },
    );

    return jsonDecode(
      response.body,
    );
  }

  // Đăng ký khóa học
  static Future<Map<String, dynamic>>
  registerCourse({
    required int maHocVien,
    required int maKhoaHoc,
  }) async {

    final response = await http.post(

      Uri.parse(
        "$baseUrl/register_course.php",
      ),

      body: {

        "MaHocVien":
        maHocVien.toString(),

        "MaKhoaHoc":
        maKhoaHoc.toString(),
      },
    );

    return jsonDecode(
      response.body,
    );
  }
}