import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class ClassService {
  static Future<List<dynamic>> getClasses({String? token}) async {
    try {
      final json = await ApiClient.getJson('lophoc', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      developer.log('ClassService error: $e', name: 'ClassService');
      return [];
    }
  }
}

