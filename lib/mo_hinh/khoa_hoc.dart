class Course {
  final int id;
  final String tenKhoaHoc;
  final String? trinhDo;
  final String? moTa;
  final String? hocPhi;
  final String? trangThai;

  Course({
    required this.id,
    required this.tenKhoaHoc,
    this.trinhDo,
    this.moTa,
    this.hocPhi,
    this.trangThai,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: int.parse((json['khoaHocID'] ?? json['id'] ?? 0).toString()),
      tenKhoaHoc: json['tenKhoaHoc'] ?? '',
      trinhDo: json['trinhDo']?.toString() ?? json['TrinhDo'],
      moTa: json['moTa']?.toString() ?? json['MoTa'],
      hocPhi: json['hocPhi']?.toString() ?? json['HocPhi'],
      trangThai: json['trangThai']?.toString() ?? json['TrangThai'],
    );
  }
}

class Topic {
  final int id;
  final String tieuDe;
  final int thuTu;
  final String? moTa;

  Topic({
    required this.id,
    required this.tieuDe,
    required this.thuTu,
    this.moTa,
  });

  factory Topic.fromJson(Map<String, dynamic> json) {
    return Topic(
      id: int.parse((json['baiHocID'] ?? json['id'] ?? 0).toString()),
      tieuDe: json['tenBaiHoc'] ?? json['tieuDe'] ?? '',
      thuTu: int.parse((json['thuTuHienThi'] ?? 0).toString()),
      moTa: json['moTa'],
    );
  }
}

class Lesson {
  final int id;
  final String tieuDe;
  final String? loai; // Listening, Speaking, Reading, Writing, Vocabulary, Grammar
  final String? videoUrl;
  final String? noiDung;
  final int thuTu;

  Lesson({
    required this.id,
    required this.tieuDe,
    this.loai,
    this.videoUrl,
    this.noiDung,
    required this.thuTu,
  });

  factory Lesson.fromJson(Map<String, dynamic> json) {
    return Lesson(
      id: int.parse((json['phanBaiHocID'] ?? json['id'] ?? 0).toString()),
      tieuDe: json['tieuDe'] ?? json['tenPhanBaiHoc'] ?? '',
      loai: json['loaiPhanBaiHoc']?.toString() ?? json['loai']?.toString(),
      videoUrl: json['videoUrl'],
      noiDung: json['noiDungText'] ?? json['noiDung'],
      thuTu: int.parse((json['thuTuHienThi'] ?? 0).toString()),
    );
  }
}
