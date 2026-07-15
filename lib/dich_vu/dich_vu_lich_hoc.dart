import '../tien_ich/api_client.dart';
import '../mo_hinh/lich_hoc.dart';

class ScheduleService {
  static Future<List<LichHoc>> getStudentSchedule(int studentId) async {
    try {
      final response = await ApiClient.getJson('/lichhoc/hocvien/$studentId');
      if (response['status'] == true && response['data'] != null) {
        final List<dynamic> data = response['data'];
        return data.map((json) => LichHoc.fromJson(json)).toList();
      }
    } catch (e) {
      print('Lỗi lấy lịch học: $e');
    }
    return [];
  }

  static Future<List<LichHoc>> getScheduleByClass(int classId) async {
    try {
      final response = await ApiClient.getJson('/lichhoc/lophoc/$classId');
      if (response['status'] == true && response['data'] != null) {
        final List<dynamic> data = response['data'];
        return data.map((json) => LichHoc.fromJson(json)).toList();
      }
    } catch (e) {
      print('Lỗi lấy lịch học theo lớp: $e');
    }
    return [];
  }
}
