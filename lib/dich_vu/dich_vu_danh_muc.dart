import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class CategoryService {
  static Future<List<dynamic>> getCategories({String? token}) async {
    try {
      final json = await ApiClient.getJson('khoahoc', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      developer.log('CategoryService error: $e', name: 'CategoryService');
      return [];
    }
  }
}
