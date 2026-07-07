import 'api_client.dart';

class EnrollmentService {
  static Future<Map<String, dynamic>> registerClass({
    required int maHocVien,
    required int maLop,
  }) async {
    try {
      return await ApiClient.postJson(
        'dangkylop',
        {
          'MaHocVien': maHocVien,
          'MaLop': maLop,
        },
      );
    } catch (e) {
      return {'status': false, 'message': 'Lỗi đăng ký lớp: $e'};
    }
  }
}

