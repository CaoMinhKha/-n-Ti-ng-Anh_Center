import 'dart:convert';
import 'package:http/http.dart' as http;

class CourseService {

  static const String baseUrl =
      "http://192.168.1.4/admin_ENGLISHcenter/api";

  static Future<List<dynamic>> getCourses() async {

    try {
      final response = await http.get(
        Uri.parse("$baseUrl/courses.php"),
      );

      print("STATUS CODE: ${response.statusCode}");
      print("BODY: ${response.body}");

      if (response.statusCode == 200) {

        final json = jsonDecode(response.body);

        if (json["status"].toString().toLowerCase() == "success") {
          return List<dynamic>.from(json["data"]);
        }
      }

      return [];
    } catch (e) {
      print("ERROR: $e");
      return [];
    }
  }
}