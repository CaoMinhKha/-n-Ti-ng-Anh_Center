import '../tien_ich/api_client.dart';

class CourseService {
  // Lấy danh sách khóa học: GET /api/khoahoc
  static Future<List<dynamic>> getCourses() async {
    final res = await ApiClient.getJson('/khoahoc');
    return res['status'] == true ? res['data'] : [];
  }

  // Xem chi tiết khóa học: GET /api/khoahoc/{id}
  static Future<Map<String, dynamic>> getCourseDetail(int id) async {
    return await ApiClient.getJson('/khoahoc/$id');
  }

  // Lấy danh sách bài học của khóa học: GET /api/khoahoc/{khoaHocId}/baihoc
  static Future<List<dynamic>> getLessons(int khoaHocId) async {
    final res = await ApiClient.getJson('/khoahoc/$khoaHocId/baihoc');
    return res['status'] == true ? res['data'] : [];
  }
}

class ClassService {
  // Lấy danh sách lớp học: GET /api/lophoc
  static Future<List<dynamic>> getClasses() async {
    final res = await ApiClient.getJson('/lophoc');
    return res['status'] == true ? res['data'] : [];
  }

  // Xem danh sách đăng ký của lớp: GET /api/lophoc/{lopHocId}/dangky
  static Future<List<dynamic>> getEnrollments(int lopHocId) async {
    final res = await ApiClient.getJson('/lophoc/$lopHocId/dangky');
    return res['status'] == true ? res['data'] : [];
  }

  // Đăng ký vào lớp học: POST /api/lophoc/{lopHocId}/dangky
  static Future<Map<String, dynamic>> enrollInClass(int lopHocId, int hocVienId, double hocPhi) async {
    return await ApiClient.postJson('/lophoc/$lopHocId/dangky', {
      'HocVienID': hocVienId,
      'HocPhi': hocPhi,
    });
  }
}
