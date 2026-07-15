import '../tien_ich/api_client.dart';
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';

class AuthService {
  static Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await ApiClient.postJson('/auth/login', {
      'email': email,
      'password': password,
    });

    if (response['status'] == true || response['accessToken'] != null) {
      final token = response['accessToken'];
      final user = response['user'];

      if (token != null) await UserSession.saveToken(token.toString());
      if (user != null) {
        await UserSession.saveUserName(user['hoVaTen']?.toString() ?? 'Người dùng');
        await UserSession.saveUserRole(user['vaiTro']?.toString() ?? 'HOC_VIEN');
        final userId = user['id'];
        if (userId != null) await UserSession.saveUserId(int.parse(userId.toString()));
      }
    }
    return response;
  }

  // Nhận vào Map data để khớp với gọi từ UI
  static Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    return await ApiClient.postJson('/auth/register', data);
  }

  static Future<Map<String, dynamic>> verifyEmail(String email, String otp) async {
    return await ApiClient.postJson('/auth/verify-email', {'email': email, 'otp': otp});
  }

  static Future<Map<String, dynamic>> resendOtp(String email) async {
    return await ApiClient.postJson('/auth/resend-otp', {'email': email});
  }

  static Future<Map<String, dynamic>> getMe() async {
    return await ApiClient.getJson('/auth/me');
  }
}
