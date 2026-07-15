class GiaoVien {
  final int maGiaoVien;
  final String tenDangNhap;
  final String hoTen;
  final String? email;
  final String? soDienThoai;
  final String? diaChi;
  final int gioiTinh;
  final int trangThai;

  GiaoVien({
    required this.maGiaoVien,
    required this.tenDangNhap,
    required this.hoTen,
    this.email,
    this.soDienThoai,
    this.diaChi,
    required this.gioiTinh,
    required this.trangThai,
  });

  factory GiaoVien.fromJson(Map<String, dynamic> json) {
    return GiaoVien(
      maGiaoVien: int.parse(json['MaGiaoVien'].toString()),
      tenDangNhap: json['TenDangNhap'] ?? '',
      hoTen: json['HoTen'] ?? '',
      email: json['Email'],
      soDienThoai: json['SoDienThoai'],
      diaChi: json['DiaChi'],
      gioiTinh: int.parse(json['GioiTinh'].toString()),
      trangThai: int.parse(json['TrangThai'].toString()),
    );
  }
}
