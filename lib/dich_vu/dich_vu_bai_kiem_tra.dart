import '../tien_ich/api_client.dart';

class ExamService {
  static Future<List<dynamic>> getQuestions(int examId) async {
    final res = await ApiClient.getJson('/baikiemtra/$examId/cauhoi');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }

  static Future<Map<String, dynamic>> createSubmission({
    required int examId,
    required int studentId,
    required int classId,
  }) async {
    return await ApiClient.postJson('/bailam', {
      'BaiKiemTraID': examId,
      'HocVienID': studentId,
      'LopHocID': classId,
      'ThoiGianBatDau': DateTime.now().toIso8601String(),
      'TrangThai': 'DANG_LAM',
    });
  }

  static Future<Map<String, dynamic>> submitExam({
    required int studentId,
    required int examId,
    required double score,
    required int correctAnswers,
    required int totalQuestions,
  }) async {
    return await ApiClient.postJson('/bailam', {
      'HocVienID': studentId,
      'BaiKiemTraID': examId,
      'TongDiem': score,
      'SoCauDung': correctAnswers,
      'TongSoCau': totalQuestions,
      'TrangThai': 'DA_NOP',
    });
  }

  static Future<List<dynamic>> getResults(int studentId) async {
    final res = await ApiClient.getJson('/reports/student/results');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }

  // ==========================
  // THÊM HÀM NÀY
  // ==========================
  static Future<Map<String, dynamic>> submitAnswerDetail({
    required int submissionId,
    required int questionId,
    int? answerId,
    String? content,
  }) async {
    return await ApiClient.postJson('/bailam/chitiet', {
      'BaiLamID': submissionId,
      'CauHoiID': questionId,
      'DapAnID': answerId,
      'NoiDungTraLoi': content,
    });
  }

  // ==========================
  // THÊM HÀM NÀY
  // ==========================
  static Future<List<dynamic>> getExams() async {
    final res = await ApiClient.getJson('/baikiemtra');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }
}