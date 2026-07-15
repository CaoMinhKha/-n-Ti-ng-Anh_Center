import '../tien_ich/api_client.dart';

class AttendanceService {
  static Future<List<dynamic>> getAttendanceByClass(int classId, String date) async {
    final response = await ApiClient.getJson('attendance?classId=$classId&date=$date');
    return response['status'] == true ? response['data'] : [];
  }

  static Future<Map<String, dynamic>> markAttendance({
    required int studentId,
    required int classId,
    required String date,
    required String status,
    String? note,
  }) async {
    return await ApiClient.postJson('attendance', {
      'MaHocVien': studentId,
      'MaLop': classId,
      'NgayDiem': date,
      'TrangThai': status,
      'GhiChu': note,
    });
  }
}
