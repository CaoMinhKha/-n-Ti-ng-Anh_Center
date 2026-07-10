import 'package:app_tienganh/dich_vu/dich_vu_dang_ky_khoa_hoc.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('CourseRegisterService', () {
    test('returns success for successful API payload', () {
      final result = CourseRegisterService.parseRegisterResult({
        'status': true,
        'message': 'success',
      });

      expect(result, 'success');
    });

    test('returns exist when API reports duplicate registration', () {
      final result = CourseRegisterService.parseRegisterResult({
        'status': false,
        'message': 'Bạn đã đăng ký rồi',
      });

      expect(result, 'exist');
    });

    test('returns API message when backend returns an error', () {
      final result = CourseRegisterService.parseRegisterResult({
        'status': false,
        'message': 'Hết chỗ',
      });

      expect(result, 'Hết chỗ');
    });
  });
}
