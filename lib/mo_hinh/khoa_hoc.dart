class Course {

  int maKhoaHoc;
  String tenKhoaHoc;
  String trinhDo;
  String moTa;

  Course({
    required this.maKhoaHoc,
    required this.tenKhoaHoc,
    required this.trinhDo,
    required this.moTa,
  });

  factory Course.fromJson(
      Map<String,dynamic> json){

    return Course(
      maKhoaHoc:
      int.parse(
        json["MaKhoaHoc"].toString(),
      ),

      tenKhoaHoc:
      json["TenKhoaHoc"],

      trinhDo:
      json["TrinhDo"],

      moTa:
      json["MoTa"],
    );
  }
}