import 'api_client.dart';

class RegisterService {
  static Future<Map<String, dynamic>> register({
    required String username,
    required String password,
    required String hoten,
    required String email,
  }) async {
    return ApiClient.postJson(
      'hocvien',
      {
        'TenDangNhap': username,
        'MatKhau': password,
        'HoTen': hoten,
        'Email': email,
        'TrangThai': 1,
      },
    );
  }
}
