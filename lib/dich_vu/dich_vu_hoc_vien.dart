import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class StudentService {
  static Future<List<dynamic>> getStudents() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/hocvien'),
      );
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['status'] == true) {
          return List<dynamic>.from(json['data'] ?? []);
        }
      }
    } catch (e) {
      developer.log('StudentService error: $e', name: 'StudentService');
    }
    return [];
  }
}

