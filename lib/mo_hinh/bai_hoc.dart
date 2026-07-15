class BaiHoc {
  final int maBaiHoc;
  final String tieuDe;
  final String? noiDung;
  final int thuTu;
  final int maKhoaHoc;
  final String trangThai;

  BaiHoc({
    required this.maBaiHoc,
    required this.tieuDe,
    this.noiDung,
    required this.thuTu,
    required this.maKhoaHoc,
    required this.trangThai,
  });

  factory BaiHoc.fromJson(Map<String, dynamic> json) {
    return BaiHoc(
      maBaiHoc: int.parse(json['MaBaiHoc']?.toString() ?? '0'),
      tieuDe: json['TieuDe'] ?? '',
      noiDung: json['NoiDung'],
      thuTu: int.parse(json['ThuTu']?.toString() ?? '1'),
      maKhoaHoc: int.parse(json['MaKhoaHoc']?.toString() ?? '0'),
      trangThai: json['TrangThai'] ?? 'active',
    );
  }
}
