import 'dart:developer' as developer;
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';
import 'api_client.dart';

class LessonService {
  static Future<List<dynamic>> getLessons({String? slug, bool includeFull = false, int? id}) async {
    try {
      final token = await UserSession.getToken();
      final queryParams = <String, String>{};
      if (slug != null && slug.isNotEmpty) {
        queryParams['slug'] = slug;
      }
      if (includeFull) {
        queryParams['include'] = 'full';
      }
      if (id != null) {
        queryParams['id'] = id.toString();
      }

      final json = await ApiClient.getJson(
        'baihoc',
        token: token,
        queryParams: queryParams.isEmpty ? null : queryParams,
      );

      if (json['status'] == true) {
        final data = json['data'];
        if (data is List) {
          return List<dynamic>.from(data);
        }
        if (data != null) {
          return [data];
        }
      }
    } catch (e) {
      developer.log('LessonService error: $e', name: 'LessonService');
    }
    return [];
  }
}

