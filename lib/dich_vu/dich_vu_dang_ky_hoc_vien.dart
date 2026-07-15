import 'api_client.dart';
import 'api_response_helper.dart';

class EnrollmentService {
  static Future<List<dynamic>> getAllRegistrations({String? token}) async {
    try {
      final json = await ApiClient.getJson('dangky', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      print('EnrollmentService error: $e');
      return [];
    }
  }

  static Future<Map<String, dynamic>> registerClass({
    required int maHocVien,
    required int maLop,
  }) async {
    try {
      return await ApiClient.postJson(
        'dangky',
        {
          'HocVienID': maHocVien,
          'LopHocID': maLop,
        },
      );
    } catch (e) {
      return {'status': false, 'message': 'Lỗi đăng ký lớp: $e'};
    }
  }
}
