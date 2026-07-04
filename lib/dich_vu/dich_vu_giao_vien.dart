import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class TeacherService {
  static Future<List<dynamic>> getTeachers({String? token}) async {
    try {
      final json = await ApiClient.getJson('giaovien', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
    } catch (e) {
      developer.log('TeacherService error: $e', name: 'TeacherService');
    }
    return [];
  }
}

