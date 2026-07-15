import '../tien_ich/api_client.dart';

class ClassService {
  static Future<List<dynamic>> getClasses({String? token}) async {
    try {
      final json = await ApiClient.getJson('/lophoc', token: token);
      if (json['status'] == true) {
        return json['data'] ?? [];
      }
    } catch (e) {
      print('ClassService error: $e');
    }
    return buildFallbackClasses();
  }

  static List<dynamic> buildFallbackClasses() {
    return [
      {
        'MaLop': 201,
        'TenLop': 'Lớp Tiếng Anh Cơ Bản',
        'MaKhoaHoc': 1,
        'MaGiaoVien': 1,
        'SoChoConLai': 10,
        'TrangThai': 'SAP_KHAI_GIANG',
        'LichHoc': []
      }
    ];
  }
}
