import 'dart:developer' as developer;

import 'api_client.dart';
import '../tien_ich/phien_lam_viec_nguoi_dung.dart';

class CourseRegisterService {
  static Future<String> registerCourse({
    required int maHocVien,
    required int maKhoaHoc,
  }) async {
    try {
      final payload = {
        'MaHocVien': maHocVien,
        'MaKhoaHoc': maKhoaHoc,
      };

      final token = await UserSession.getToken();
      final json = await ApiClient.postJson(
        'dangkylop',
        payload,
        token: token?.isNotEmpty == true ? token : null,
      );

      final status = json['status'];
      final message = json['message']?.toString() ?? '';
      final normalizedMessage = message.toLowerCase();

      if (status == true || status == 1 || status == '1' || status == 'success' || normalizedMessage == 'success') {
        return 'success';
      }

      if (status == 'exist' || status == 'đã đăng ký' ||
          normalizedMessage.contains('exist') ||
          normalizedMessage.contains('đã đăng ký') ||
          normalizedMessage.contains('already registered')) {
        return 'exist';
      }

      if (message.isNotEmpty) {
        return message;
      }

      return 'error';
    } catch (e, stackTrace) {
      developer.log(
        'CourseRegisterService.registerCourse failed',
        error: e,
        stackTrace: stackTrace,
      );
      return e.toString();
    }
  }
}
