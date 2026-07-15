import '../tien_ich/api_client.dart';

class EvaluationService {
  // Lấy danh sách đánh giá của học viên từ giáo viên (bảng danhgiahocvien)
  static Future<List<dynamic>> getStudentEvaluations(int studentId) async {
    final response = await ApiClient.getJson('evaluations?studentId=$studentId');
    return response['status'] == true ? response['data'] : [];
  }

  // Lấy lịch sử chuyên cần (bảng chuyencan)
  static Future<List<dynamic>> getAttendanceHistory(int studentId) async {
    final response = await ApiClient.getJson('attendance-history?studentId=$studentId');
    return response['status'] == true ? response['data'] : [];
  }
}
