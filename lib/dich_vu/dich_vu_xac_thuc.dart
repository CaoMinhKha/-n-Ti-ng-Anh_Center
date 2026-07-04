import 'api_client.dart';

class AuthService {
  static Future<Map<String, dynamic>> login({
    required String username,
    required String password,
  }) async {
    return ApiClient.postJson(
      'dangnhap',
      {
        'username': username,
        'password': password,
      },
    );
  }
}
