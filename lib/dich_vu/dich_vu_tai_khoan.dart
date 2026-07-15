import '../tien_ich/api_client.dart';

class AccountService {
  // Lấy danh sách tài khoản: GET /api/taikhoan
  static Future<Map<String, dynamic>> getAccounts({
    int page = 1,
    int limit = 10,
    String? search,
    String role = 'ALL',
    String status = 'ALL',
  }) async {
    String query = 'page=$page&limit=$limit&role=$role&status=$status';
    if (search != null) query += '&search=$search';
    
    return await ApiClient.getJson('/taikhoan?$query');
  }

  // Thêm mới tài khoản: POST /api/taikhoan
  static Future<Map<String, dynamic>> createAccount(Map<String, dynamic> data) async {
    return await ApiClient.postJson('/taikhoan', data);
  }

  // Khóa/Mở khóa tài khoản: PATCH /api/taikhoan/{id}/toggle-status
  static Future<Map<String, dynamic>> toggleStatus(int id) async {
    return await ApiClient.postJson('/taikhoan/$id/toggle-status', {});
  }
}
