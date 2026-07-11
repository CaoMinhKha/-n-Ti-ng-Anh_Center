import 'dart:developer' as developer;
import 'api_client.dart';
import 'api_response_helper.dart';

class ClassService {
  // Fallback sample classes used when backend returns empty or fails.
  static List<dynamic> buildFallbackClasses() {
    return [
      {
        'MaLop': 201,
        'MaKhoaHoc': 101,
        'TenLop': 'Tiếng Anh 1 - Sáng',
        'MaGiaoVien': 11,
        'SoChoConLai': 8,
        'LichHoc': [
          {'ThuHoc': 2, 'GioBatDau': '08:00', 'GioKetThuc': '09:30', 'Buoi': 'morning'},
          {'ThuHoc': 4, 'GioBatDau': '08:00', 'GioKetThuc': '09:30', 'Buoi': 'morning'},
        ],
      },
      {
        'MaLop': 202,
        'MaKhoaHoc': 101,
        'TenLop': 'Tiếng Anh 1 - Chiều',
        'MaGiaoVien': 12,
        'SoChoConLai': 5,
        'LichHoc': [
          {'ThuHoc': 3, 'GioBatDau': '18:30', 'GioKetThuc': '20:00', 'Buoi': 'afternoon'},
          {'ThuHoc': 5, 'GioBatDau': '18:30', 'GioKetThuc': '20:00', 'Buoi': 'afternoon'},
        ],
      },
      {
        'MaLop': 204,
        'MaKhoaHoc': 101,
        'TenLop': 'Tiếng Anh 1 - Tối',
        'MaGiaoVien': 14,
        'SoChoConLai': 6,
        'LichHoc': [
          {'ThuHoc': 6, 'GioBatDau': '20:00', 'GioKetThuc': '21:30', 'Buoi': 'evening'},
        ],
      },
      {
        'MaLop': 203,
        'MaKhoaHoc': 102,
        'TenLop': 'Tiếng Anh 2 - Sáng',
        'MaGiaoVien': 13,
        'SoChoConLai': 3,
        'LichHoc': [
          {'ThuHoc': 2, 'GioBatDau': '08:00', 'GioKetThuc': '09:30', 'Buoi': 'morning'},
          {'ThuHoc': 4, 'GioBatDau': '08:00', 'GioKetThuc': '09:30', 'Buoi': 'morning'},
        ],
      },
      {
        'MaLop': 205,
        'MaKhoaHoc': 102,
        'TenLop': 'Tiếng Anh 2 - Chiều',
        'MaGiaoVien': 15,
        'SoChoConLai': 4,
        'LichHoc': [
          {'ThuHoc': 3, 'GioBatDau': '18:30', 'GioKetThuc': '20:00', 'Buoi': 'afternoon'},
        ],
      },
      {
        'MaLop': 206,
        'MaKhoaHoc': 102,
        'TenLop': 'Tiếng Anh 2 - Tối',
        'MaGiaoVien': 16,
        'SoChoConLai': 2,
        'LichHoc': [
          {'ThuHoc': 6, 'GioBatDau': '20:00', 'GioKetThuc': '21:30', 'Buoi': 'evening'},
        ],
      },
      {
        'MaLop': 207,
        'MaKhoaHoc': 103,
        'TenLop': 'Tiếng Anh 3 - Sáng',
        'MaGiaoVien': 17,
        'SoChoConLai': 7,
        'LichHoc': [
          {'ThuHoc': 2, 'GioBatDau': '08:00', 'GioKetThuc': '09:30', 'Buoi': 'morning'},
        ],
      },
      {
        'MaLop': 208,
        'MaKhoaHoc': 103,
        'TenLop': 'Tiếng Anh 3 - Chiều',
        'MaGiaoVien': 18,
        'SoChoConLai': 9,
        'LichHoc': [
          {'ThuHoc': 3, 'GioBatDau': '18:30', 'GioKetThuc': '20:00', 'Buoi': 'afternoon'},
        ],
      },
      {
        'MaLop': 209,
        'MaKhoaHoc': 103,
        'TenLop': 'Tiếng Anh 3 - Tối',
        'MaGiaoVien': 19,
        'SoChoConLai': 4,
        'LichHoc': [
          {'ThuHoc': 6, 'GioBatDau': '20:00', 'GioKetThuc': '21:30', 'Buoi': 'evening'},
        ],
      },
    ];
  }

  static Future<List<dynamic>> getClasses({String? token}) async {
    try {
      final json = await ApiClient.getJson('lophoc', token: token);
      final data = parseListResponse(json);
      if (data.isNotEmpty) return data;
      return buildFallbackClasses();
    } catch (e) {
      developer.log('ClassService error: $e', name: 'ClassService');
      return buildFallbackClasses();
    }
  }
}

