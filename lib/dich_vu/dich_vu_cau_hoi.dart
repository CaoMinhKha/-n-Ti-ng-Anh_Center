import 'api_client.dart';
import 'api_response_helper.dart';

class QuestionService {
  static Future<List<dynamic>> getQuestions({String? type, String? search}) async {
    try {
      String path = 'cauhoi';
      Map<String, String> params = {};
      if (type != null) params['loaiCauHoi'] = type;
      if (search != null) params['search'] = search;
      
      final json = await ApiClient.getJson(path, params: params);
      if (json['status'] == true) {
        return parseListResponse(json);
      }
      return [];
    } catch (e) {
      print('QuestionService error: $e');
      return [];
    }
  }

  static Future<List<dynamic>> getQuestionTypes() async {
    try {
      final json = await ApiClient.getJson('cauhoi/types');
      if (json['status'] == true) return json['data'] ?? [];
      return ['NGHE_HIEU', 'DOC_HIEU', 'NGU_PHAP', 'TU_VUNG', 'SAP_XEP', 'DIEN_VAO_CHO_TRONG'];
    } catch (e) {
      return ['NGHE_HIEU', 'DOC_HIEU', 'NGU_PHAP', 'TU_VUNG', 'SAP_XEP', 'DIEN_VAO_CHO_TRONG'];
    }
  }
}
