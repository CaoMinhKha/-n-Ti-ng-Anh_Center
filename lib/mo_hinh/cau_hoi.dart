class CauHoi {
  final int id;
  final String loaiCauHoi;
  final String? noiDungText;
  final String? noiDungUrl;
  final String? tieuDe;
  final List<DapAn> danhSachDapAn;

  CauHoi({
    required this.id,
    required this.loaiCauHoi,
    this.noiDungText,
    this.noiDungUrl,
    this.tieuDe,
    required this.danhSachDapAn,
  });

  factory CauHoi.fromJson(Map<String, dynamic> json) {
    var list = (json['dapan'] ?? json['DapAn'] ?? []) as List;
    List<DapAn> dapAnList = list.map((i) => DapAn.fromJson(i)).toList();

    return CauHoi(
      id: int.parse((json['CauHoiID'] ?? json['id'] ?? 0).toString()),
      loaiCauHoi: json['LoaiCauHoi'] ?? 'TRAC_NGHIEM_MOT_DAP_AN',
      noiDungText: json['NoiDungText'],
      noiDungUrl: json['NoiDungUrl'],
      tieuDe: json['TieuDe'],
      danhSachDapAn: dapAnList,
    );
  }
}

class DapAn {
  final int id;
  final String? noiDungText;
  final bool laDapAnDung;

  DapAn({required this.id, this.noiDungText, required this.laDapAnDung});

  factory DapAn.fromJson(Map<String, dynamic> json) {
    return DapAn(
      id: int.parse((json['DapAnID'] ?? json['id'] ?? 0).toString()),
      noiDungText: json['NoiDungText'],
      laDapAnDung: json['LaDapAnDung'] == true || json['LaDapAnDung'] == 1,
    );
  }
}
