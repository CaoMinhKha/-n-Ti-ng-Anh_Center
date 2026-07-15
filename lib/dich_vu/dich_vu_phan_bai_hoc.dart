import '../tien_ich/api_client.dart';

class PhanBaiHocService {
  // Lấy danh sách phần bài học
  static Future<List<dynamic>> getLessonsByTopic(int topicId) async {
    final res = await ApiClient.getJson('/baihoc/$topicId/phanbaihoc');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }

  // Alias để tương thích với các màn hình cũ
  static Future<List<dynamic>> getPhanBaiHoc(int topicId) async {
    return await getLessonsByTopic(topicId);
  }

  // Chi tiết phần bài học
  static Future<Map<String, dynamic>> getLessonDetail(int lessonId) async {
    final res = await ApiClient.getJson('/phanbaihoc/$lessonId');
    return res['status'] == true ? (res['data'] ?? res) : {};
  }

  // Câu hỏi
  static Future<List<dynamic>> getQuestions(int lessonId) async {
    final res = await ApiClient.getJson('/cauhoi?maPhanBaiHoc=$lessonId');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }
}