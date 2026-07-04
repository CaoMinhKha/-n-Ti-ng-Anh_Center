import 'package:flutter_test/flutter_test.dart';
import 'package:app_tienganh/dich_vu/api_response_helper.dart';

void main() {
  group('parseListResponse', () {
    test('parses a standard API payload with status and data', () {
      final payload = {
        'status': true,
        'data': [
          {'id': 1, 'name': 'A'},
          {'id': 2, 'name': 'B'},
        ],
      };

      expect(parseListResponse(payload), hasLength(2));
      expect(parseListResponse(payload).first['name'], 'A');
    });

    test('accepts a raw list payload', () {
      final payload = [
        {'id': 1, 'name': 'A'},
        {'id': 2, 'name': 'B'},
      ];

      expect(parseListResponse(payload), hasLength(2));
    });
  });
}
