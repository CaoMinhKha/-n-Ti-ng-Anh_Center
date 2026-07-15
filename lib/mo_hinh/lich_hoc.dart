class LichHoc {
  final int id;
  final int lopHocId;
  final String tenLop;
  final int thuHoc; // thu_trong_tuan
  final String tenThu;
  final String buoi; // ca_hoc
  final String gioBatDau;
  final String gioKetThuc;
  final String? phongHoc;
  final String trangThai;

  LichHoc({
    required this.id,
    required this.lopHocId,
    required this.tenLop,
    required this.thuHoc,
    required this.tenThu,
    required this.buoi,
    required this.gioBatDau,
    required this.gioKetThuc,
    this.phongHoc,
    required this.trangThai,
  });

  factory LichHoc.fromJson(Map<String, dynamic> json) {
    return LichHoc(
      id: int.parse((json['id'] ?? 0).toString()),
      lopHocId: int.parse((json['lop_hoc_id'] ?? 0).toString()),
      tenLop: json['lop_hoc'] ?? 'Lớp học',
      thuHoc: int.parse((json['thu_trong_tuan'] ?? 0).toString()),
      tenThu: json['ten_thu'] ?? '',
      buoi: json['ca_hoc'] ?? 'morning',
      gioBatDau: _formatTime(json['gio_bat_dau']),
      gioKetThuc: _formatTime(json['gio_ket_thuc']),
      phongHoc: json['phong_hoc'],
      trangThai: json['trang_thai'] ?? 'HOAT_DONG',
    );
  }

  static String _formatTime(dynamic time) {
    if (time == null) return '--:--';
    try {
      DateTime dt = DateTime.parse(time.toString());
      return '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    } catch (_) {
      return time.toString();
    }
  }
}
