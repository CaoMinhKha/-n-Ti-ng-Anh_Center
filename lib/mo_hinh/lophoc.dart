import 'lich_hoc.dart';

class LopHoc {
  final int maLop;
  final String tenLop;
  final int maKhoaHoc;
  final int? maGiaoVien;
  final int soLuongToiDa;
  final String? trangThai;
  final List<LichHoc>? lichHoc;

  LopHoc({
    required this.maLop,
    required this.tenLop,
    required this.maKhoaHoc,
    this.maGiaoVien,
    required this.soLuongToiDa,
    this.trangThai,
    this.lichHoc,
  });

  factory LopHoc.fromJson(Map<String, dynamic> json) {
    var list = json['LichHoc'] as List?;
    List<LichHoc>? lichHocList = list?.map((i) => LichHoc.fromJson(i)).toList();

    return LopHoc(
      maLop: int.parse(json['MaLop']?.toString() ?? '0'),
      tenLop: json['TenLop'] ?? '',
      maKhoaHoc: int.parse(json['MaKhoaHoc']?.toString() ?? '0'),
      maGiaoVien: json['MaGiaoVien'] != null ? int.parse(json['MaGiaoVien'].toString()) : null,
      soLuongToiDa: int.parse(json['SoLuongToiDa']?.toString() ?? '0'),
      trangThai: json['TrangThai'],
      lichHoc: lichHocList,
    );
  }
}
