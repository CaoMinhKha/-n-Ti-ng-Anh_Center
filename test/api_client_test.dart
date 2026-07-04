import 'package:flutter_test/flutter_test.dart';
import 'package:app_tienganh/dich_vu/api_client.dart';

void main() {
  group('ApiClient', () {
    test('builds backend URL with request query', () {
      final uri = ApiClient.buildUri('khoahoc');
      expect(uri.toString(), contains('/index.php?request=khoahoc'));
    });

    test('creates auth headers with bearer token', () {
      final headers = ApiClient.buildHeaders(token: 'demo-token');
      expect(headers['Authorization'], 'Bearer demo-token');
      expect(headers['Content-Type'], 'application/json');
    });
  });
}
