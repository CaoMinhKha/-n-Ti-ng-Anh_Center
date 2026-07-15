import '../tien_ich/api_client.dart';

class AppDataService {
  // --- 1. QUẢN LÝ TÀI KHOẢN ---
  static Future<List<Map<String, dynamic>>> loadUsers({String role = 'ALL'}) async {
    final path = role != 'ALL' ? '/taikhoan?role=$role' : '/taikhoan';
    final res = await ApiClient.getJson(path);
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<void> addUser(Map<String, dynamic> data) => ApiClient.postJson('/taikhoan', data);
  static Future<void> updateUser(String id, Map<String, dynamic> data) => ApiClient.putJson('/taikhoan/$id', data);
  static Future<void> deleteUser(String id) => ApiClient.putJson('/taikhoan/$id', {'isDeleted': true});

  // --- 2. QUẢN LÝ ĐÀO TẠO ---
  static Future<List<Map<String, dynamic>>> loadCategories() async {
    final res = await ApiClient.getJson('/danhmuc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadCourses() async {
    final res = await ApiClient.getJson('/khoahoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadClasses() async {
    final res = await ApiClient.getJson('/lophoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> getTeacherClasses() async {
    final res = await ApiClient.getJson('/lophoc'); // API sẽ tự filter theo token
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }

  // --- 3. QUẢN LÝ LỊCH HỌC & PHÒNG ---
  static Future<List<Map<String, dynamic>>> loadRooms() async {
    final res = await ApiClient.getJson('/phonghoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadShifts() async {
    final res = await ApiClient.getJson('/cahoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadSchedules() async {
    final res = await ApiClient.getJson('/lichhoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }

  // --- 4. QUẢN LÝ NỘI DUNG & KIỂM TRA ---
  static Future<List<Map<String, dynamic>>> loadAllTopics() async {
    final res = await ApiClient.getJson('/baihoc');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadQuestions() async {
    final res = await ApiClient.getJson('/cauhoi');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadTests() async {
    final res = await ApiClient.getJson('/baikiemtra');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }

  // --- 5. ĐĂNG KÝ & ĐIỂM SỐ ---
  static Future<List<Map<String, dynamic>>> loadRegistrations() async {
    final res = await ApiClient.getJson('/lophoc/1/dangky'); // Mock endpoint
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> getClassStudents(int lopHocId) async {
    final res = await ApiClient.getJson('/lophoc/$lopHocId/dangky');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<void> markAttendance(Map<String, dynamic> data) => ApiClient.postJson('/diemdanh', data);
  static Future<void> updateGrade(Map<String, dynamic> data) => ApiClient.postJson('/ketqua', data);

  // --- 6. TÀI CHÍNH & THÔNG BÁO ---
  static Future<List<Map<String, dynamic>>> loadAnnouncements() async {
    final res = await ApiClient.getJson('/thongbao'); // Giả định endpoint
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }
  static Future<List<Map<String, dynamic>>> loadInvoices() async {
    final res = await ApiClient.getJson('/reports/admin/revenue');
    return res['status'] == true ? List<Map<String, dynamic>>.from(res['data'] ?? []) : [];
  }

  // --- 7. HÀNH ĐỘNG CHUNG ---
  static Future<void> deleteEntity(String path, String id) => ApiClient.putJson('$path/$id', {'isDeleted': true});
  static Future<void> addEntity(String path, Map<String, dynamic> data) => ApiClient.postJson(path, data);
  static Future<void> updateEntity(String path, String id, Map<String, dynamic> data) => ApiClient.putJson('$path/$id', data);
  
  // Tương thích ngược
  static Future<void> addCourse(Map<String, dynamic> data) => addEntity('/khoahoc', data);
  static Future<void> updateCourse(String id, Map<String, dynamic> data) => updateEntity('/khoahoc', id, data);
  static Future<void> addClass(Map<String, dynamic> data) => addEntity('/lophoc', data);
  static Future<void> updateClass(String id, Map<String, dynamic> data) => updateEntity('/lophoc', id, data);
}
