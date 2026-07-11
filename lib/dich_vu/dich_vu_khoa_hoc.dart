import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class CourseService {
  // Fallback sample courses used when backend returns empty or fails.
  static List<dynamic> buildFallbackCourses() {
    return [
      {
        'MaKhoaHoc': 1,
        'TenKhoaHoc': 'Tiếng Anh 1',
        'TrinhDo': 'A1',
        'MoTa': 'Tiếng Anh cơ bản cho người mới bắt đầu.',
      },
      {
        'MaKhoaHoc': 2,
        'TenKhoaHoc': 'Tiếng Anh 2',
        'TrinhDo': 'A2',
        'MoTa': 'Tiếng Anh trình độ trung cấp, nâng cao giao tiếp.',
      },
      {
        'MaKhoaHoc': 3,
        'TenKhoaHoc': 'Tiếng Anh 3',
        'TrinhDo': 'A2',
        'MoTa': 'Tiếng Anh nâng cao cấp độ A2-B1.',
      },
      {
        'MaKhoaHoc': 4,
        'TenKhoaHoc': 'Luyện thi 2/6',
        'TrinhDo': '2/6',
        'MoTa': 'Luyện thi tiếng Anh chuyên sâu theo định hướng 2/6.',
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
