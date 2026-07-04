import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class StudentService {
  static Future<List<dynamic>> getStudents({String? token}) async {
    try {
      final json = await ApiClient.getJson('hocvien', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
    } catch (e) {
      developer.log('StudentService error: $e', name: 'StudentService');
    }
    return [];
  }
}

