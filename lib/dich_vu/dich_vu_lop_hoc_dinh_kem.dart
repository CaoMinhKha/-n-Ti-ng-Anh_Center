class ClassScheduleModel {
  final String id;
  final String title;
  final String level;
  final String shift;
  final String days;
  final String description;
  final String teacher;
  final int seats;

  const ClassScheduleModel({
    required this.id,
    required this.title,
    required this.level,
    required this.shift,
    required this.days,
    required this.description,
    required this.teacher,
    required this.seats,
  });

  factory ClassScheduleModel.fromMap(Map<String, dynamic> map) {
    return ClassScheduleModel(
      id: map['id']?.toString() ?? '',
      title: map['title']?.toString() ?? 'Lớp học',
      level: map['level']?.toString() ?? 'Tiếng Anh',
      shift: map['shift']?.toString() ?? 'Sáng',
      days: map['days']?.toString() ?? 'Thứ 2,4,6',
      description: map['description']?.toString() ?? 'Lớp học tiếng Anh',
      teacher: map['teacher']?.toString() ?? 'Chưa phân công',
      seats: int.tryParse(map['seats']?.toString() ?? '0') ?? 0,
    );
  }
}
