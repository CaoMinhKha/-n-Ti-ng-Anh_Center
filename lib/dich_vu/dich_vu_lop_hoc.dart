import 'dart:convert';
import 'dart:developer' as developer;
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class ClassService {
  static Future<List<dynamic>> getClasses() async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/lophoc'),
      );
      if (response.statusCode == 200) {
        final json = jsonDecode(response.body);
        if (json['status'] == true) {
          return List<dynamic>.from(json['data'] ?? []);
        }
      }
      return [];
    } catch (e) {
      developer.log('ClassService error: $e', name: 'ClassService');
      return [];
    }
  }
}

