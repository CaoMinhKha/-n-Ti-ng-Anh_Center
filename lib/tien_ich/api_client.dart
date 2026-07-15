import 'dart:convert';
import 'package:http/http.dart' as http;
import 'hang_so_api.dart';
import 'phien_lam_viec_nguoi_dung.dart';

class ApiClient {
  static Future<Map<String, dynamic>> getJson(String endpoint, {String? token}) async {
    final authToken = token ?? await UserSession.getToken();
    try {
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (authToken != null) 'Authorization': 'Bearer $authToken',
        },
      );
      return _handleResponse(response);
    } catch (e) {
      return {'status': false, 'message': 'Lỗi kết nối server: $e'};
    }
  }

  // Alias cho getJson để fix lỗi gọi ApiClient.get()
  static Future<Map<String, dynamic>> get(String endpoint, {String? token}) => getJson(endpoint, token: token);

  static Future<Map<String, dynamic>> postJson(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final authToken = token ?? await UserSession.getToken();
    try {
      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (authToken != null) 'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode(body),
      );
      return _handleResponse(response);
    } catch (e) {
      return {'status': false, 'message': 'Lỗi kết nối server: $e'};
    }
  }

  static Future<Map<String, dynamic>> putJson(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final authToken = token ?? await UserSession.getToken();
    try {
      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}$endpoint'),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          if (authToken != null) 'Authorization': 'Bearer $authToken',
        },
        body: jsonEncode(body),
      );
      return _handleResponse(response);
    } catch (e) {
      return {'status': false, 'message': 'Lỗi kết nối server: $e'};
    }
  }

  static Map<String, dynamic> _handleResponse(http.Response response) {
    final dynamic data = jsonDecode(response.body);
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (data is Map<String, dynamic>) {
        if (!data.containsKey('status')) data['status'] = true;
        return data;
      }
      return {'status': true, 'data': data};
    } else {
      return {
        'status': false,
        'message': data is Map ? (data['error'] ?? data['message'] ?? 'Lỗi hệ thống') : 'Lỗi ${response.statusCode}',
        'code': response.statusCode
      };
    }
  }
}
