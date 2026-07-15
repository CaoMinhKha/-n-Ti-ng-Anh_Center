import 'api_client.dart';
import 'api_response_helper.dart';

class OpeningSessionService {
  static Future<List<dynamic>> getOpeningSessions({String? token}) async {
    try {
      final json = await ApiClient.getJson('dotkhaigiang', token: token);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      print('OpeningSessionService error: $e');
      return [];
    }
  }
}
