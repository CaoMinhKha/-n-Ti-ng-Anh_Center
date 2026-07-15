import '../tien_ich/api_client.dart';

class ReportService {
  // Lấy dữ liệu Dashboard Học viên: GET /api/reports/student/dashboard
  static Future<Map<String, dynamic>> getStudentDashboard() async {
    final res = await ApiClient.getJson('/reports/student/dashboard');
    return res['status'] == true ? res : {};
  }

  // Lấy kết quả học tập Học viên: GET /api/reports/student/results
  static Future<List<dynamic>> getStudentResults() async {
    final res = await ApiClient.getJson('/reports/student/results');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }

  // Lấy lịch sử điểm danh Học viên: GET /api/reports/student/attendance
  static Future<List<dynamic>> getStudentAttendance() async {
    final res = await ApiClient.getJson('/reports/student/attendance');
    return res['status'] == true ? (res['data'] ?? []) : [];
  }

  // Dashboard Giáo viên: GET /api/reports/teacher/dashboard
  static Future<Map<String, dynamic>> getTeacherDashboard() async {
    final res = await ApiClient.getJson('/reports/teacher/dashboard');
    return res['status'] == true ? res : {};
  }

  // Dashboard Admin: GET /api/reports/admin/dashboard
  static Future<Map<String, dynamic>> getAdminDashboard() async {
    final res = await ApiClient.getJson('/reports/admin/dashboard');
    return res['status'] == true ? res : {};
  }
}
