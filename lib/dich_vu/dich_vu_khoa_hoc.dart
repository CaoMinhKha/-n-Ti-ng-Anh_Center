import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class CourseService {
  // Fallback sample courses used when backend returns empty or fails.
  static List<dynamic> buildFallbackCourses() {
    return [
      {
        'MaKhoaHoc': 101,
        'TenKhoaHoc': 'Tiếng Anh 1',
        'TrinhDo': 'Beginner',
        'MoTa': 'Tiếng Anh cơ bản cho người mới bắt đầu.',
      },
      {
        'MaKhoaHoc': 102,
        'TenKhoaHoc': 'Tiếng Anh 2',
        'TrinhDo': 'Intermediate',
        'MoTa': 'Tiếng Anh trình độ trung cấp, nâng cao giao tiếp.',
      },
      {
        'MaKhoaHoc': 103,
        'TenKhoaHoc': 'Tiếng Anh 3',
        'TrinhDo': 'Upper Intermediate',
        'MoTa': 'Luyện nâng cao, chuẩn bị các kỹ năng chuyên sâu.',
      },
    ];
  }

  static Future<List<dynamic>> getCourses({String? token}) async {
    try {
      final json = await ApiClient.getJson('khoahoc', token: token);
      final data = parseListResponse(json);
      if (data.isNotEmpty) return data;
      return buildFallbackCourses();
    } catch (e) {
      developer.log('CourseService error: $e', name: 'CourseService');
      return buildFallbackCourses();
    }
  }
}
