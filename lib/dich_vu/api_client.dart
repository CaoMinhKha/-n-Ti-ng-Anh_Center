import 'dart:convert';
import 'package:http/http.dart' as http;
import '../tien_ich/hang_so_api.dart';

class ApiClient {
  static Uri buildUri(String endpoint, {Map<String, String>? queryParams}) {
    final query = <String, String>{'request': endpoint};
    if (queryParams != null) {
      query.addAll(queryParams);
    }
    final uri = Uri.parse('${ApiConstants.baseUrl}/index.php');
    return uri.replace(queryParameters: query);
  }

  static Map<String, String> buildHeaders({String? token}) {
    final headers = <String, String>{'Content-Type': 'application/json'};
    if (token != null && token.isNotEmpty) {
      headers['Authorization'] = 'Bearer $token';
    }
    return headers;
  }

  static Future<Map<String, dynamic>> getJson(String endpoint, {String? token, Map<String, String>? queryParams}) async {
    final response = await http.get(
      buildUri(endpoint, queryParams: queryParams),
      headers: buildHeaders(token: token),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> postJson(String endpoint, dynamic body, {String? token}) async {
    final response = await http.post(
      buildUri(endpoint),
      headers: buildHeaders(token: token),
      body: jsonEncode(body),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> putJson(String endpoint, dynamic body, {String? token, int? id}) async {
    final queryParams = id != null ? {'id': id.toString()} : null;
    final response = await http.put(
      buildUri(endpoint, queryParams: queryParams),
      headers: buildHeaders(token: token),
      body: jsonEncode(body),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  static Future<Map<String, dynamic>> deleteJson(String endpoint, {String? token, int? id}) async {
    final queryParams = id != null ? {'id': id.toString()} : null;
    final response = await http.delete(
      buildUri(endpoint, queryParams: queryParams),
      headers: buildHeaders(token: token),
    );
    if (response.statusCode != 200) {
      throw Exception('HTTP ${response.statusCode}: ${response.body}');
    }
    return jsonDecode(response.body) as Map<String, dynamic>;
  }
}
