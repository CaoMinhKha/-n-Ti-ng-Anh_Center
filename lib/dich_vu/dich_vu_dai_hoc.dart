import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class UniversityService {
  static Future<List<dynamic>> getPrograms({String? token}) async {
    try {
      final json = await ApiClient.getJson('khoahoc', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      developer.log('UniversityService error: $e', name: 'UniversityService');
      return [];
    }
  }
}
