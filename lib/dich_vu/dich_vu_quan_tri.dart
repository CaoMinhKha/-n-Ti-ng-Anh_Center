import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class AppDataService {
  static const String _usersKey = 'admin_users';
  static const String _coursesKey = 'admin_courses';
  static const String _classesKey = 'admin_classes';
  static const String _registrationsKey = 'admin_registrations';
  static const String _categoriesKey = 'admin_categories';
  static const String _intakesKey = 'admin_intakes';
  static const String _lessonsKey = 'admin_lessons';
  static const String _questionsKey = 'admin_questions';
  static const String _testsKey = 'admin_tests';

  static Future<SharedPreferences> _prefs() async => SharedPreferences.getInstance();

  static Future<List<Map<String, dynamic>>> loadUsers() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_usersKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addUser(Map<String, dynamic> user) async {
    final users = await loadUsers();
    final nextId = (users.length + 1).toString();
    final record = {
      'id': nextId,
      'HoTen': user['HoTen'] ?? 'Người dùng',
      'TenDangNhap': user['TenDangNhap'] ?? 'user$nextId',
      'Email': user['Email'] ?? '',
      'VaiTro': user['VaiTro'] ?? 'student',
      'TrangThai': user['TrangThai'] ?? 'active',
      'SoDienThoai': user['SoDienThoai'] ?? '',
    };
    users.add(record);
    final prefs = await _prefs();
    await prefs.setString(_usersKey, jsonEncode(users));
    return record;
  }

  static Future<void> updateUser(String id, Map<String, dynamic> user) async {
    final users = await loadUsers();
    final index = users.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      users[index] = {...users[index], ...user, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_usersKey, jsonEncode(users));
    }
  }

  static Future<void> deleteUser(String id) async {
    final users = await loadUsers();
    final usersLeft = users.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_usersKey, jsonEncode(usersLeft));
  }

  static Future<List<Map<String, dynamic>>> loadCourses() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_coursesKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addCourse(Map<String, dynamic> course) async {
    final courses = await loadCourses();
    final nextId = (courses.length + 1).toString();
    final record = {
      'id': nextId,
      'TenKhoaHoc': course['TenKhoaHoc'] ?? 'Khóa học mới',
      'MoTa': course['MoTa'] ?? '',
      'TrinhDo': course['TrinhDo'] ?? 'Beginner',
      'TrangThai': course['TrangThai'] ?? 'active',
      'DanhMuc': course['DanhMuc'] ?? 'General',
    };
    courses.add(record);
    final prefs = await _prefs();
    await prefs.setString(_coursesKey, jsonEncode(courses));
    return record;
  }

  static Future<void> updateCourse(String id, Map<String, dynamic> course) async {
    final courses = await loadCourses();
    final index = courses.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      courses[index] = {...courses[index], ...course, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_coursesKey, jsonEncode(courses));
    }
  }

  static Future<void> deleteCourse(String id) async {
    final courses = await loadCourses();
    final left = courses.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_coursesKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadClasses() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_classesKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addClass(Map<String, dynamic> classData) async {
    final classes = await loadClasses();
    final nextId = (classes.length + 1).toString();
    final record = {
      'id': nextId,
      'TenLop': classData['TenLop'] ?? 'Lớp mới',
      'MaKhoaHoc': classData['MaKhoaHoc'] ?? '',
      'MaGiaoVien': classData['MaGiaoVien'] ?? '',
      'TrangThai': classData['TrangThai'] ?? 'active',
      'NgayKhaiGiang': classData['NgayKhaiGiang'] ?? '',
    };
    classes.add(record);
    final prefs = await _prefs();
    await prefs.setString(_classesKey, jsonEncode(classes));
    return record;
  }

  static Future<void> updateClass(String id, Map<String, dynamic> classData) async {
    final classes = await loadClasses();
    final index = classes.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      classes[index] = {...classes[index], ...classData, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_classesKey, jsonEncode(classes));
    }
  }

  static Future<void> deleteClass(String id) async {
    final classes = await loadClasses();
    final left = classes.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_classesKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadRegistrations() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_registrationsKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addRegistration(Map<String, dynamic> registration) async {
    final registrations = await loadRegistrations();
    final nextId = (registrations.length + 1).toString();
    final record = {
      'id': nextId,
      'HoTenHocVien': registration['HoTenHocVien'] ?? 'Học viên',
      'TenKhoaHoc': registration['TenKhoaHoc'] ?? '',
      'TenLop': registration['TenLop'] ?? '',
      'TrangThai': registration['TrangThai'] ?? 'pending',
    };
    registrations.add(record);
    final prefs = await _prefs();
    await prefs.setString(_registrationsKey, jsonEncode(registrations));
    return record;
  }

  static Future<void> updateRegistration(String id, Map<String, dynamic> registration) async {
    final registrations = await loadRegistrations();
    final index = registrations.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      registrations[index] = {...registrations[index], ...registration, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_registrationsKey, jsonEncode(registrations));
    }
  }

  static Future<void> deleteRegistration(String id) async {
    final registrations = await loadRegistrations();
    final left = registrations.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_registrationsKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadCategories() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_categoriesKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addCategory(Map<String, dynamic> category) async {
    final categories = await loadCategories();
    final nextId = (categories.length + 1).toString();
    final record = {
      'id': nextId,
      'TenDanhMuc': category['TenDanhMuc'] ?? 'Danh mục mới',
      'MoTa': category['MoTa'] ?? '',
    };
    categories.add(record);
    final prefs = await _prefs();
    await prefs.setString(_categoriesKey, jsonEncode(categories));
    return record;
  }

  static Future<void> updateCategory(String id, Map<String, dynamic> category) async {
    final categories = await loadCategories();
    final index = categories.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      categories[index] = {...categories[index], ...category, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_categoriesKey, jsonEncode(categories));
    }
  }

  static Future<void> deleteCategory(String id) async {
    final categories = await loadCategories();
    final left = categories.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_categoriesKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadIntakes() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_intakesKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addIntake(Map<String, dynamic> intake) async {
    final intakes = await loadIntakes();
    final nextId = (intakes.length + 1).toString();
    final record = {
      'id': nextId,
      'TenDot': intake['TenDot'] ?? 'Đợt mới',
      'NgayBatDau': intake['NgayBatDau'] ?? '',
      'NgayKetThuc': intake['NgayKetThuc'] ?? '',
      'TrangThai': intake['TrangThai'] ?? 'planned',
    };
    intakes.add(record);
    final prefs = await _prefs();
    await prefs.setString(_intakesKey, jsonEncode(intakes));
    return record;
  }

  static Future<void> updateIntake(String id, Map<String, dynamic> intake) async {
    final intakes = await loadIntakes();
    final index = intakes.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      intakes[index] = {...intakes[index], ...intake, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_intakesKey, jsonEncode(intakes));
    }
  }

  static Future<void> deleteIntake(String id) async {
    final intakes = await loadIntakes();
    final left = intakes.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_intakesKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadLessons() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_lessonsKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addLesson(Map<String, dynamic> lesson) async {
    final lessons = await loadLessons();
    final nextId = (lessons.length + 1).toString();
    final record = {
      'id': nextId,
      'TieuDe': lesson['TieuDe'] ?? 'Bài học mới',
      'NoiDung': lesson['NoiDung'] ?? '',
      'MaKhoaHoc': lesson['MaKhoaHoc'] ?? '',
      'TrangThai': lesson['TrangThai'] ?? 'draft',
    };
    lessons.add(record);
    final prefs = await _prefs();
    await prefs.setString(_lessonsKey, jsonEncode(lessons));
    return record;
  }

  static Future<void> updateLesson(String id, Map<String, dynamic> lesson) async {
    final lessons = await loadLessons();
    final index = lessons.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      lessons[index] = {...lessons[index], ...lesson, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_lessonsKey, jsonEncode(lessons));
    }
  }

  static Future<void> deleteLesson(String id) async {
    final lessons = await loadLessons();
    final left = lessons.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_lessonsKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadQuestions() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_questionsKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addQuestion(Map<String, dynamic> question) async {
    final questions = await loadQuestions();
    final nextId = (questions.length + 1).toString();
    final record = {
      'id': nextId,
      'NoiDung': question['NoiDung'] ?? 'Câu hỏi mới',
      'DapAn': question['DapAn'] ?? '',
      'Loai': question['Loai'] ?? 'choice',
    };
    questions.add(record);
    final prefs = await _prefs();
    await prefs.setString(_questionsKey, jsonEncode(questions));
    return record;
  }

  static Future<void> updateQuestion(String id, Map<String, dynamic> question) async {
    final questions = await loadQuestions();
    final index = questions.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      questions[index] = {...questions[index], ...question, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_questionsKey, jsonEncode(questions));
    }
  }

  static Future<void> deleteQuestion(String id) async {
    final questions = await loadQuestions();
    final left = questions.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_questionsKey, jsonEncode(left));
  }

  static Future<List<Map<String, dynamic>>> loadTests() async {
    final prefs = await _prefs();
    final raw = prefs.getString(_testsKey) ?? '[]';
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded.map((e) => Map<String, dynamic>.from(e)).toList();
  }

  static Future<Map<String, dynamic>> addTest(Map<String, dynamic> test) async {
    final tests = await loadTests();
    final nextId = (tests.length + 1).toString();
    final record = {
      'id': nextId,
      'TenBaiKiemTra': test['TenBaiKiemTra'] ?? 'Bài kiểm tra mới',
      'ThoiLuong': test['ThoiLuong'] ?? '30 phút',
      'TrangThai': test['TrangThai'] ?? 'draft',
    };
    tests.add(record);
    final prefs = await _prefs();
    await prefs.setString(_testsKey, jsonEncode(tests));
    return record;
  }

  static Future<void> updateTest(String id, Map<String, dynamic> test) async {
    final tests = await loadTests();
    final index = tests.indexWhere((item) => item['id'].toString() == id);
    if (index >= 0) {
      tests[index] = {...tests[index], ...test, 'id': id};
      final prefs = await _prefs();
      await prefs.setString(_testsKey, jsonEncode(tests));
    }
  }

  static Future<void> deleteTest(String id) async {
    final tests = await loadTests();
    final left = tests.where((item) => item['id'].toString() != id).toList();
    final prefs = await _prefs();
    await prefs.setString(_testsKey, jsonEncode(left));
  }

  static Future<void> resetAll() async {
    final prefs = await _prefs();
    await prefs.remove(_usersKey);
    await prefs.remove(_coursesKey);
    await prefs.remove(_classesKey);
    await prefs.remove(_registrationsKey);
    await prefs.remove(_categoriesKey);
    await prefs.remove(_intakesKey);
    await prefs.remove(_lessonsKey);
    await prefs.remove(_questionsKey);
    await prefs.remove(_testsKey);
  }
}
