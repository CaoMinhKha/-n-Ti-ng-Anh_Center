import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class CourseService {
  static Future<List<dynamic>> getCourses() async {
    try {
      final response = await http.get(
        Uri.parse("${ApiConstants.baseUrl}/khoahoc"),
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json["status"] == true) {
          return List<dynamic>.from(json["data"] ?? []);
        }
      }
      return [];
    } catch (e) {
      developer.log("ERROR: $e", name: 'CourseService');
      return [];
    }
  }
}
