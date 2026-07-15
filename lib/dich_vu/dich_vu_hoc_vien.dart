import '../tien_ich/api_client.dart';

class StudentService {
  static Future<List<dynamic>> getStudents({String? token}) async {
    try {
      final json = await ApiClient.getJson('/hocvien', token: token);
      if (json['status'] == true) {
        return json['data'] ?? [];
      }
    } catch (e) {
      print('StudentService error: $e');
    }
    return [];
  }
}
