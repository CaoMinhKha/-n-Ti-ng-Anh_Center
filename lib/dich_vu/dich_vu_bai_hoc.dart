import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class LessonService {
  static Future<List<dynamic>> getLessons() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/baihoc'),
      );
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['status'] == true) {
          return List<dynamic>.from(json['data'] ?? []);
        }
      }
    } catch (e) {
      developer.log('LessonService error: $e', name: 'LessonService');
    }
    return [];
  }
}

