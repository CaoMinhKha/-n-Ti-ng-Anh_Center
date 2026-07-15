import '../tien_ich/api_client.dart';
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';

class ApiService {
  // Đăng nhập chuẩn Swagger Node.js
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiClient.postJson('/auth/login', {
      'email': email,
      'password': password,
    });
    
    if (response['status'] == true && response['accessToken'] != null) {
      await UserSession.saveToken(response['accessToken']);
      final user = response['user'];
      if (user != null) {
        await UserSession.saveUserName(user['hoVaTen'] ?? '');
        await UserSession.saveUserRole(user['vaiTro'] ?? 'HOC_VIEN');
        await UserSession.saveUserId(int.parse(user['id'].toString()));
      }
    }
    return response;
  }

  // Đăng ký tài khoản học viên mới
  static Future<Map<String, dynamic>> register({
    required String hoVaTen,
    required String email,
    required String password,
    required String ngaySinh,
    required String gioiTinh,
  }) async {
    return await ApiClient.postJson('/auth/register', {
      'hoVaTen': hoVaTen,
      'email': email,
      'password': password,
      'ngaySinh': ngaySinh,
      'gioiTinh': gioiTinh,
    });
  }

  // Lấy dữ liệu Dashboard tổng quát (Dành cho Admin)
  static Future<Map<String, dynamic>> getAdminStats() async {
    return await ApiClient.getJson('/reports/admin/dashboard');
  }

  // Lấy dữ liệu Dashboard Giáo viên
  static Future<Map<String, dynamic>> getTeacherStats() async {
    return await ApiClient.getJson('/reports/teacher/dashboard');
  }

  // Lấy dữ liệu Dashboard Học viên
  static Future<Map<String, dynamic>> getStudentStats() async {
    return await ApiClient.getJson('/reports/student/dashboard');
  }
}
