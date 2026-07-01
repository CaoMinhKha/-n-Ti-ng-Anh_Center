import 'dart:convert';
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class EnrollmentService {
  static Future<Map<String, dynamic>> registerClass({
    required int maHocVien,
    required int maLop,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}/dangkylop'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'MaHocVien': maHocVien,
          'MaLop': maLop,
        }),
      );
      return jsonDecode(response.body) as Map<String, dynamic>;
    } catch (e) {
      return {'status': false, 'message': 'Lỗi đăng ký lớp: $e'};
    }
  }
}

