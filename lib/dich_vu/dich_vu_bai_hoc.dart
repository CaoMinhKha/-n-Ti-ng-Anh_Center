import '../tien_ich/api_client.dart';

class LessonService {
  static Future<List<dynamic>> getLessonsByCourse(int courseId) async {
    try {
      final response = await ApiClient.getJson('lessons?courseId=$courseId');
      if (response['status'] == true && response['data'] != null) {
        return response['data'];
      }
    } catch (e) {
      print('Lỗi lấy danh sách bài học: $e');
    }
    return [];
  }

  static Future<List<dynamic>> getQuestionsByLesson(int lessonId) async {
    try {
      final response = await ApiClient.getJson('questions?lessonId=$lessonId');
      if (response['status'] == true && response['data'] != null) {
        return response['data'];
      }
    } catch (e) {
      print('Lỗi lấy câu hỏi bài học: $e');
    }
    return [];
  }

  static Future<List<dynamic>> getStudentProgress(int studentId) async {
    try {
      final response = await ApiClient.getJson('progress?studentId=$studentId');
      if (response['status'] == true && response['data'] != null) {
        return response['data'];
      }
    } catch (e) {
      print('Lỗi lấy tiến độ học tập: $e');
    }
    return [];
  }

  static Future<Map<String, dynamic>> updateProgress(int studentId, int lessonId, double percentage) async {
    return await ApiClient.postJson('update-progress', {
      'MaHocVien': studentId,
      'MaBaiHoc': lessonId,
      'PhanTramHoanThanh': percentage,
    });
  }
}
