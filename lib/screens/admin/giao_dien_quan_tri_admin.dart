import 'dart:convert';
import 'dart:typed_data';

import 'package:file_picker/file_picker.dart';
import 'package:csv/csv.dart';
import 'package:excel/excel.dart';
import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';

class AdminManagementScreen extends StatefulWidget {
  const AdminManagementScreen({super.key});

  @override
  State<AdminManagementScreen> createState() => _AdminManagementScreenState();
}

class _AdminManagementScreenState extends State<AdminManagementScreen> {
  final TextEditingController _searchController = TextEditingController();
  bool loading = true;
  List<Map<String, dynamic>> users = [];
  List<Map<String, dynamic>> categories = [];
  List<Map<String, dynamic>> intakes = [];
  List<Map<String, dynamic>> courses = [];
  List<Map<String, dynamic>> classes = [];
  List<Map<String, dynamic>> registrations = [];
  List<Map<String, dynamic>> lessons = [];
  List<Map<String, dynamic>> questions = [];
  List<Map<String, dynamic>> tests = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => loading = true);
    final loadedUsers = await AppDataService.loadUsers();
    final loadedCategories = await AppDataService.loadCategories();
    final loadedIntakes = await AppDataService.loadIntakes();
    final loadedCourses = await AppDataService.loadCourses();
    final loadedClasses = await AppDataService.loadClasses();
    final loadedRegistrations = await AppDataService.loadRegistrations();
    final loadedLessons = await AppDataService.loadLessons();
    final loadedQuestions = await AppDataService.loadQuestions();
    final loadedTests = await AppDataService.loadTests();

    if (!mounted) return;
    setState(() {
      users = loadedUsers;
      categories = loadedCategories;
      intakes = loadedIntakes;
      courses = loadedCourses;
      classes = loadedClasses;
      registrations = loadedRegistrations;
      lessons = loadedLessons;
      questions = loadedQuestions;
      tests = loadedTests;
      loading = false;
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<Map<String, dynamic>> _applySearch(List<Map<String, dynamic>> items) {
    final query = _searchController.text.trim().toLowerCase();
    if (query.isEmpty) {
      return items;
    }
    return items.where((item) {
      final values = item.values.map((value) => value.toString().toLowerCase()).join(' ');
      return values.contains(query);
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return DefaultTabController(
      length: 9,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Quản trị trung tâm'),
          bottom: const TabBar(
            isScrollable: true,
            tabs: [
              Tab(text: 'Người dùng'),
              Tab(text: 'Danh mục'),
              Tab(text: 'Đợt khai giảng'),
              Tab(text: 'Khóa học'),
              Tab(text: 'Lớp học'),
              Tab(text: 'Đăng ký'),
              Tab(text: 'Bài học'),
              Tab(text: 'Câu hỏi'),
              Tab(text: 'Bài kiểm tra'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            _buildUsersTab(),
            _buildCategoriesTab(),
            _buildIntakesTab(),
            _buildCoursesTab(),
            _buildClassesTab(),
            _buildRegistrationsTab(),
            _buildLessonsTab(),
            _buildQuestionsTab(),
            _buildTestsTab(),
          ],
        ),
      ),
    );
  }

  Widget _buildUsersTab() {
    return _buildEntityScreen(
      title: 'Quản lý người dùng',
      addLabel: 'Thêm người dùng',
      items: _applySearch(users),
      onRefresh: _loadData,
      onAdd: () => _showUserDialog(),
      itemBuilder: (item) => _UserCard(
        item: item,
        onEdit: () => _showUserDialog(user: item),
        onDelete: () => _deleteUser(item),
      ),
    );
  }

  Widget _buildCategoriesTab() {
    return _buildEntityScreen(
      title: 'Quản lý danh mục',
      addLabel: 'Thêm danh mục',
      items: _applySearch(categories),
      onRefresh: _loadData,
      onAdd: () => _showCategoryDialog(),
      itemBuilder: (item) => _CategoryCard(
        item: item,
        onEdit: () => _showCategoryDialog(category: item),
        onDelete: () => _deleteCategory(item),
      ),
    );
  }

  Widget _buildIntakesTab() {
    return _buildEntityScreen(
      title: 'Quản lý đợt khai giảng',
      addLabel: 'Thêm đợt',
      items: _applySearch(intakes),
      onRefresh: _loadData,
      onAdd: () => _showIntakeDialog(),
      itemBuilder: (item) => _IntakeCard(
        item: item,
        onEdit: () => _showIntakeDialog(intake: item),
        onDelete: () => _deleteIntake(item),
      ),
    );
  }

  Widget _buildCoursesTab() {
    return _buildEntityScreen(
      title: 'Quản lý khóa học',
      addLabel: 'Thêm khóa học',
      items: _applySearch(courses),
      onRefresh: _loadData,
      onAdd: () => _showCourseDialog(),
      itemBuilder: (item) => _CourseCard(
        item: item,
        onEdit: () => _showCourseDialog(course: item),
        onDelete: () => _deleteCourse(item),
      ),
    );
  }

  Widget _buildClassesTab() {
    return _buildEntityScreen(
      title: 'Quản lý lớp học',
      addLabel: 'Thêm lớp học',
      items: _applySearch(classes),
      onRefresh: _loadData,
      onAdd: () => _showClassDialog(),
      itemBuilder: (item) => _ClassCard(
        item: item,
        teachers: users.where((u) => (u['VaiTro'] ?? 'student').toString() == 'teacher').toList(),
        onEdit: () => _showClassDialog(classData: item),
        onDelete: () => _deleteClass(item),
      ),
    );
  }

  Widget _buildRegistrationsTab() {
    return _buildEntityScreen(
      title: 'Quản lý đăng ký lớp học',
      addLabel: 'Thêm đăng ký',
      items: _applySearch(registrations),
      onRefresh: _loadData,
      onAdd: () => _showRegistrationDialog(),
      itemBuilder: (item) => _RegistrationCard(
        item: item,
        onEdit: () => _showRegistrationDialog(registration: item),
        onDelete: () => _deleteRegistration(item),
      ),
    );
  }

  Widget _buildLessonsTab() {
    return _buildEntityScreen(
      title: 'Quản lý bài học',
      addLabel: 'Thêm bài học',
      items: _applySearch(lessons),
      onRefresh: _loadData,
      onAdd: () => _showLessonDialog(),
      itemBuilder: (item) => _LessonCard(
        item: item,
        onEdit: () => _showLessonDialog(lesson: item),
        onDelete: () => _deleteLesson(item),
      ),
    );
  }

  Widget _buildQuestionsTab() {
    return _buildEntityScreen(
      title: 'Quản lý câu hỏi',
      addLabel: 'Thêm câu hỏi',
      items: _applySearch(questions),
      onRefresh: _loadData,
      onAdd: () => _showQuestionDialog(),
      extraAction: _buildImportButton(),
      itemBuilder: (item) => _QuestionCard(
        item: item,
        onTap: () => _showQuestionDetails(item),
        onEdit: () => _showQuestionDialog(question: item),
        onDelete: () => _deleteQuestion(item),
      ),
    );
  }

  Widget _buildTestsTab() {
    return _buildEntityScreen(
      title: 'Quản lý bài kiểm tra',
      addLabel: 'Thêm bài kiểm tra',
      items: _applySearch(tests),
      onRefresh: _loadData,
      onAdd: () => _showTestDialog(),
      itemBuilder: (item) => _TestCard(
        item: item,
        onEdit: () => _showTestDialog(test: item),
        onDelete: () => _deleteTest(item),
      ),
    );
  }

  Widget _buildEntityScreen({
    required String title,
    required String addLabel,
    required List<Map<String, dynamic>> items,
    required Future<void> Function() onRefresh,
    required VoidCallback onAdd,
    Widget? extraAction,
    required Widget Function(Map<String, dynamic> item) itemBuilder,
  }) {
    return RefreshIndicator(
      onRefresh: onRefresh,
      child: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
          const SizedBox(height: 10),
          Row(
            children: [
              ElevatedButton.icon(
                onPressed: onAdd,
                icon: const Icon(Icons.add_circle_outline),
                label: Text(addLabel),
              ),
              if (extraAction != null) ...[
                const SizedBox(width: 12),
                extraAction,
              ],
            ],
          ),
          const SizedBox(height: 12),
          TextField(
            controller: _searchController,
            onChanged: (_) => setState(() {}),
            decoration: const InputDecoration(
              prefixIcon: Icon(Icons.search),
              hintText: 'Tìm kiếm nhanh...',
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 12),
          if (items.isEmpty)
            const Card(
              child: Padding(
                padding: EdgeInsets.all(20),
                child: Text('Chưa có dữ liệu. Hãy thêm mới để bắt đầu.'),
              ),
            )
          else
            ...items.map(itemBuilder),
        ],
      ),
    );
  }

  Future<void> _showUserDialog({Map<String, dynamic>? user}) async {
    final nameController = TextEditingController(text: user?['HoTen']?.toString() ?? '');
    final usernameController = TextEditingController(text: user?['TenDangNhap']?.toString() ?? '');
    final emailController = TextEditingController(text: user?['Email']?.toString() ?? '');
    final phoneController = TextEditingController(text: user?['SoDienThoai']?.toString() ?? '');
    String role = user?['VaiTro']?.toString() ?? 'student';
    String status = user?['TrangThai']?.toString() ?? 'active';

    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(user == null ? 'Thêm người dùng' : 'Sửa người dùng'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Họ tên')),
              TextField(controller: usernameController, decoration: const InputDecoration(labelText: 'Tên đăng nhập')),
              TextField(controller: emailController, decoration: const InputDecoration(labelText: 'Email')),
              TextField(controller: phoneController, decoration: const InputDecoration(labelText: 'Số điện thoại')),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                initialValue: role,
                decoration: const InputDecoration(labelText: 'Vai trò'),
                items: const [
                  DropdownMenuItem(value: 'admin', child: Text('Quản trị')),
                  DropdownMenuItem(value: 'teacher', child: Text('Giáo viên')),
                  DropdownMenuItem(value: 'student', child: Text('Học viên')),
                ],
                onChanged: (value) => setState(() => role = value ?? 'student'),
              ),
              const SizedBox(height: 8),
              DropdownButtonFormField<String>(
                initialValue: status,
                decoration: const InputDecoration(labelText: 'Trạng thái'),
                items: const [
                  DropdownMenuItem(value: 'active', child: Text('Hoạt động')),
                  DropdownMenuItem(value: 'inactive', child: Text('Ngừng')),
                ],
                onChanged: (value) => setState(() => status = value ?? 'active'),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {
                'HoTen': nameController.text.trim(),
                'TenDangNhap': usernameController.text.trim(),
                'Email': emailController.text.trim(),
                'SoDienThoai': phoneController.text.trim(),
                'VaiTro': role,
                'TrangThai': status,
              };
              if (user == null) {
                await AppDataService.addUser(payload);
              } else {
                await AppDataService.updateUser(user['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showCategoryDialog({Map<String, dynamic>? category}) async {
    final nameController = TextEditingController(text: category?['TenDanhMuc']?.toString() ?? '');
    final descController = TextEditingController(text: category?['MoTa']?.toString() ?? '');
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(category == null ? 'Thêm danh mục' : 'Sửa danh mục'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Tên danh mục')),
          TextField(controller: descController, decoration: const InputDecoration(labelText: 'Mô tả')),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'TenDanhMuc': nameController.text.trim(), 'MoTa': descController.text.trim()};
              if (category == null) {
                await AppDataService.addCategory(payload);
              } else {
                await AppDataService.updateCategory(category['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showIntakeDialog({Map<String, dynamic>? intake}) async {
    final nameController = TextEditingController(text: intake?['TenDot']?.toString() ?? '');
    final startController = TextEditingController(text: intake?['NgayBatDau']?.toString() ?? '');
    final endController = TextEditingController(text: intake?['NgayKetThuc']?.toString() ?? '');
    String status = intake?['TrangThai']?.toString() ?? 'planned';
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(intake == null ? 'Thêm đợt khai giảng' : 'Sửa đợt khai giảng'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Tên đợt')),
          TextField(controller: startController, decoration: const InputDecoration(labelText: 'Ngày bắt đầu')),
          TextField(controller: endController, decoration: const InputDecoration(labelText: 'Ngày kết thúc')),
          DropdownButtonFormField<String>(
            initialValue: status,
            decoration: const InputDecoration(labelText: 'Trạng thái'),
            items: const [
              DropdownMenuItem(value: 'planned', child: Text('Kế hoạch')),
              DropdownMenuItem(value: 'ongoing', child: Text('Đang diễn ra')),
              DropdownMenuItem(value: 'closed', child: Text('Đã kết thúc')),
            ],
            onChanged: (value) => setState(() => status = value ?? 'planned'),
          ),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'TenDot': nameController.text.trim(), 'NgayBatDau': startController.text.trim(), 'NgayKetThuc': endController.text.trim(), 'TrangThai': status};
              if (intake == null) {
                await AppDataService.addIntake(payload);
              } else {
                await AppDataService.updateIntake(intake['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showCourseDialog({Map<String, dynamic>? course}) async {
    final nameController = TextEditingController(text: course?['TenKhoaHoc']?.toString() ?? '');
    final descController = TextEditingController(text: course?['MoTa']?.toString() ?? '');
    final levelController = TextEditingController(text: course?['TrinhDo']?.toString() ?? 'Beginner');
    final categoryController = TextEditingController(text: course?['DanhMuc']?.toString() ?? 'General');
    String status = course?['TrangThai']?.toString() ?? 'active';
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(course == null ? 'Thêm khóa học' : 'Sửa khóa học'),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Tên khóa học')),
            TextField(controller: descController, decoration: const InputDecoration(labelText: 'Mô tả')),
            TextField(controller: levelController, decoration: const InputDecoration(labelText: 'Trình độ')),
            TextField(controller: categoryController, decoration: const InputDecoration(labelText: 'Danh mục')),
            DropdownButtonFormField<String>(
              initialValue: status,
              decoration: const InputDecoration(labelText: 'Trạng thái'),
              items: const [
                DropdownMenuItem(value: 'active', child: Text('Hoạt động')),
                DropdownMenuItem(value: 'draft', child: Text('Nháp')),
              ],
              onChanged: (value) => setState(() => status = value ?? 'active'),
            ),
          ]),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'TenKhoaHoc': nameController.text.trim(), 'MoTa': descController.text.trim(), 'TrinhDo': levelController.text.trim(), 'DanhMuc': categoryController.text.trim(), 'TrangThai': status};
              if (course == null) {
                await AppDataService.addCourse(payload);
              } else {
                await AppDataService.updateCourse(course['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showClassDialog({Map<String, dynamic>? classData}) async {
    final nameController = TextEditingController(text: classData?['TenLop']?.toString() ?? '');
    final courseController = TextEditingController(text: classData?['MaKhoaHoc']?.toString() ?? '');
    final dateController = TextEditingController(text: classData?['NgayKhaiGiang']?.toString() ?? '');
    String teacherId = classData?['MaGiaoVien']?.toString() ?? '';
    String status = classData?['TrangThai']?.toString() ?? 'active';
    final teacherList = users.where((u) => (u['VaiTro'] ?? 'student').toString() == 'teacher').toList();

    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(classData == null ? 'Thêm lớp học' : 'Sửa lớp học'),
        content: SingleChildScrollView(
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: nameController, decoration: const InputDecoration(labelText: 'Tên lớp')),
            TextField(controller: courseController, decoration: const InputDecoration(labelText: 'Mã khóa học')),
            TextField(controller: dateController, decoration: const InputDecoration(labelText: 'Ngày khai giảng')),
            DropdownButtonFormField<String>(
              initialValue: teacherId.isEmpty && teacherList.isNotEmpty ? teacherList.first['id']?.toString() : teacherId,
              decoration: const InputDecoration(labelText: 'Giáo viên phụ trách'),
              items: teacherList.map((teacher) => DropdownMenuItem<String>(value: teacher['id']?.toString(), child: Text(teacher['HoTen']?.toString() ?? 'Giáo viên'))).toList(),
              onChanged: (value) => setState(() => teacherId = value ?? ''),
            ),
            DropdownButtonFormField<String>(
              initialValue: status,
              decoration: const InputDecoration(labelText: 'Trạng thái'),
              items: const [DropdownMenuItem(value: 'active', child: Text('Hoạt động')), DropdownMenuItem(value: 'closed', child: Text('Đã đóng'))],
              onChanged: (value) => setState(() => status = value ?? 'active'),
            ),
          ]),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'TenLop': nameController.text.trim(), 'MaKhoaHoc': courseController.text.trim(), 'MaGiaoVien': teacherId, 'NgayKhaiGiang': dateController.text.trim(), 'TrangThai': status};
              if (classData == null) {
                await AppDataService.addClass(payload);
              } else {
                await AppDataService.updateClass(classData['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showRegistrationDialog({Map<String, dynamic>? registration}) async {
    final studentController = TextEditingController(text: registration?['HoTenHocVien']?.toString() ?? '');
    final courseController = TextEditingController(text: registration?['TenKhoaHoc']?.toString() ?? '');
    final classController = TextEditingController(text: registration?['TenLop']?.toString() ?? '');
    String status = registration?['TrangThai']?.toString() ?? 'pending';
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(registration == null ? 'Thêm đăng ký' : 'Sửa đăng ký'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: studentController, decoration: const InputDecoration(labelText: 'Học viên')),
          TextField(controller: courseController, decoration: const InputDecoration(labelText: 'Khóa học')),
          TextField(controller: classController, decoration: const InputDecoration(labelText: 'Lớp học')),
          DropdownButtonFormField<String>(
            initialValue: status,
            decoration: const InputDecoration(labelText: 'Trạng thái'),
            items: const [
              DropdownMenuItem(value: 'pending', child: Text('Chờ duyệt')),
              DropdownMenuItem(value: 'approved', child: Text('Đã duyệt')),
              DropdownMenuItem(value: 'rejected', child: Text('Từ chối')),
            ],
            onChanged: (value) => setState(() => status = value ?? 'pending'),
          ),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'HoTenHocVien': studentController.text.trim(), 'TenKhoaHoc': courseController.text.trim(), 'TenLop': classController.text.trim(), 'TrangThai': status};
              if (registration == null) {
                await AppDataService.addRegistration(payload);
              } else {
                await AppDataService.updateRegistration(registration['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showLessonDialog({Map<String, dynamic>? lesson}) async {
    final titleController = TextEditingController(text: lesson?['TieuDe']?.toString() ?? '');
    final contentController = TextEditingController(text: lesson?['NoiDung']?.toString() ?? '');
    final courseController = TextEditingController(text: lesson?['MaKhoaHoc']?.toString() ?? '');
    String status = lesson?['TrangThai']?.toString() ?? 'draft';
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: Text(lesson == null ? 'Thêm bài học' : 'Sửa bài học'),
        content: Column(mainAxisSize: MainAxisSize.min, children: [
          TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Tiêu đề')),
          TextField(controller: contentController, maxLines: 3, decoration: const InputDecoration(labelText: 'Nội dung')),
          TextField(controller: courseController, decoration: const InputDecoration(labelText: 'Mã khóa học')),
          DropdownButtonFormField<String>(
            initialValue: status,
            decoration: const InputDecoration(labelText: 'Trạng thái'),
            items: const [DropdownMenuItem(value: 'draft', child: Text('Nháp')), DropdownMenuItem(value: 'published', child: Text('Đã xuất bản'))],
            onChanged: (value) => setState(() => status = value ?? 'draft'),
          ),
        ]),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Hủy')),
          ElevatedButton(
            onPressed: () async {
              final payload = {'TieuDe': titleController.text.trim(), 'NoiDung': contentController.text.trim(), 'MaKhoaHoc': courseController.text.trim(), 'TrangThai': status};
              if (lesson == null) {
                await AppDataService.addLesson(payload);
              } else {
                await AppDataService.updateLesson(lesson['id'].toString(), payload);
              }
              if (!mounted) return;
              Navigator.pop(context);
              await _loadData();
            },
            child: const Text('Lưu'),
          ),
        ],
      ),
    );
  }

  Future<void> _showQuestionDialog({Map<String, dynamic>? question}) async {
    final contentController = TextEditingController(text: question?['NoiDung']?.toString() ?? '');
    final lessonController = TextEditingController(text: question?['MaBaiHoc']?.toString() ?? '');
    final orderController = TextEditingController(text: question?['ThuTu']?.toString() ?? '0');
    String type = (question?['Loai'] ?? question?['LoaiCauHoi'] ?? 'multiple_choice').toString();
    final optionItems = <Map<String, dynamic>>[];
    final optionControllers = <TextEditingController>[];

    final existingAnswers = question?['DapAn'];
    if (existingAnswers is List && existingAnswers.isNotEmpty) {
      for (final answer in existingAnswers) {
        if (answer is Map) {
          optionItems.add({
            'NoiDung': answer['NoiDung']?.toString() ?? '',
            'LaDapAnDung': answer['LaDapAnDung'] == true || answer['isCorrect'] == true,
          });
        } else {
          optionItems.add({'NoiDung': answer.toString(), 'LaDapAnDung': false});
        }
      }
    }

    if (optionItems.isEmpty) {
      optionItems.addAll([
        {'NoiDung': '', 'LaDapAnDung': true},
        {'NoiDung': '', 'LaDapAnDung': false},
      ]);
    }

    for (final item in optionItems) {
      optionControllers.add(TextEditingController(text: item['NoiDung']?.toString() ?? ''));
    }

    await showDialog<void>(
      context: context,
      builder: (_) {
        return StatefulBuilder(
          builder: (dialogContext, setDialogState) {
            return AlertDialog(
              title: Text(question == null ? 'Thêm câu hỏi' : 'Sửa câu hỏi'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    TextField(controller: contentController, maxLines: 2, decoration: const InputDecoration(labelText: 'Nội dung câu hỏi')),
                    TextField(controller: lessonController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Mã bài học')),
                    TextField(controller: orderController, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Thứ tự')),
                    DropdownButtonFormField<String>(
                      value: type,
                      decoration: const InputDecoration(labelText: 'Loại câu hỏi'),
                      items: const [
                        DropdownMenuItem(value: 'multiple_choice', child: Text('Trắc nghiệm')),
                        DropdownMenuItem(value: 'essay', child: Text('Tự luận')),
                        DropdownMenuItem(value: 'fill_blank', child: Text('Điền vào chỗ trống')),
                      ],
                      onChanged: (value) => setDialogState(() => type = value ?? 'multiple_choice'),
                    ),
                    const SizedBox(height: 12),
                    const Align(alignment: Alignment.centerLeft, child: Text('Danh sách đáp án', style: TextStyle(fontWeight: FontWeight.bold))),
                    const SizedBox(height: 8),
                    ...List.generate(optionItems.length, (index) {
                      final item = optionItems[index];
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          children: [
                            Expanded(
                              child: TextField(
                                controller: optionControllers[index],
                                decoration: InputDecoration(labelText: 'Đáp án ${index + 1}'),
                              ),
                            ),
                            Checkbox(
                              value: item['LaDapAnDung'] == true,
                              onChanged: (value) => setDialogState(() => item['LaDapAnDung'] = value ?? false),
                            ),
                            IconButton(
                              onPressed: optionItems.length > 1
                                  ? () => setDialogState(() {
                                        optionItems.removeAt(index);
                                        optionControllers.removeAt(index);
                                      })
                                  : null,
                              icon: const Icon(Icons.delete_outline),
                            ),
                          ],
                        ),
                      );
                    }),
                    TextButton.icon(
                      onPressed: () => setDialogState(() {
                        optionItems.add({'NoiDung': '', 'LaDapAnDung': false});
                        optionControllers.add(TextEditingController());
                      }),
                      icon: const Icon(Icons.add_circle_outline),
                      label: const Text('Thêm đáp án'),
                    ),
                  ],
                ),
              ),
              actions: [
                TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Hủy')),
                ElevatedButton(
                  onPressed: () async {
                    final answers = <Map<String, dynamic>>[];
                    for (var index = 0; index < optionControllers.length; index++) {
                      final text = optionControllers[index].text.trim();
                      if (text.isEmpty) continue;
                      answers.add({
                        'NoiDung': text,
                        'LaDapAnDung': optionItems[index]['LaDapAnDung'] == true,
                      });
                    }
                    final payload = {
                      'MaBaiHoc': int.tryParse(lessonController.text.trim()) ?? 0,
                      'NoiDung': contentController.text.trim(),
                      'Loai': type,
                      'LoaiCauHoi': type,
                      'ThuTu': int.tryParse(orderController.text.trim()) ?? 0,
                      'DapAn': answers,
                    };
                    if (question == null) {
                      await AppDataService.addQuestion(payload);
                    } else {
                      await AppDataService.updateQuestion(question['id'].toString(), payload);
                    }
                    if (!mounted) return;
                    Navigator.pop(dialogContext);
                    await _loadData();
                  },
                  child: const Text('Lưu'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Widget _buildImportButton() {
    return OutlinedButton.icon(
      onPressed: _importQuestions,
      icon: const Icon(Icons.upload_file),
      label: const Text('Import câu hỏi'),
    );
  }

  Future<void> _importQuestions() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['csv', 'xls', 'xlsx'],
      withData: true,
    );

    if (result == null || result.files.isEmpty) {
      return;
    }

    final file = result.files.first;
    final bytes = file.bytes;
    if (bytes == null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Không thể đọc file nhập.')));
      return;
    }

    final importedQuestions = _parseQuestionsFromBytes(bytes, file.name);
    if (importedQuestions.isEmpty) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Không tìm thấy câu hỏi hợp lệ trong file.')));
      return;
    }

    int count = 0;
    for (final question in importedQuestions) {
      await AppDataService.addQuestion(question);
      count++;
    }

    if (!mounted) return;
    await _loadData();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Đã import $count câu hỏi.')));
  }

  List<Map<String, dynamic>> _parseQuestionsFromBytes(Uint8List bytes, String fileName) {
    final lowerName = fileName.toLowerCase();
    if (lowerName.endsWith('.csv')) {
      return _parseQuestionsFromCsv(utf8.decode(bytes));
    }
    return _parseQuestionsFromExcel(bytes);
  }

  List<Map<String, dynamic>> _parseQuestionsFromCsv(String content) {
    final rows = const CsvToListConverter().convert(content, eol: '\n');
    return _parseQuestionsFromRows(rows);
  }

  List<Map<String, dynamic>> _parseQuestionsFromExcel(Uint8List bytes) {
    final excel = Excel.decodeBytes(bytes);
    final rows = <List<dynamic>>[];
    for (final table in excel.tables.values) {
      if (table.maxRows > 0) {
        rows.addAll(table.rows);
      }
    }
    return _parseQuestionsFromRows(rows);
  }

  List<Map<String, dynamic>> _parseQuestionsFromRows(List<List<dynamic>> rows) {
    if (rows.isEmpty) {
      return [];
    }

    final headers = rows.first.map((cell) => cell?.toString().trim().toLowerCase() ?? '').toList();
    final questions = <Map<String, dynamic>>[];

    for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      final row = rows[rowIndex];
      if (row.every((cell) => cell == null || cell.toString().trim().isEmpty)) {
        continue;
      }

      final rowData = <String, String>{};
      for (var colIndex = 0; colIndex < headers.length; colIndex++) {
        final key = headers[colIndex];
        if (key.isEmpty || colIndex >= row.length) {
          continue;
        }
        rowData[key] = row[colIndex]?.toString().trim() ?? '';
      }

      final question = <String, dynamic>{
        'MaBaiHoc': int.tryParse(rowData['mabaihoc'] ?? rowData['lessonid'] ?? rowData['lesson'] ?? '') ?? 0,
        'NoiDung': rowData['noidung'] ?? rowData['question'] ?? rowData['content'] ?? '',
        'LoaiCauHoi': rowData['loaicauhoi'] ?? rowData['type'] ?? 'multiple_choice',
        'ThuTu': int.tryParse(rowData['thutu'] ?? rowData['order'] ?? '') ?? 0,
        'DapAn': <Map<String, dynamic>>[],
      };

      for (final entry in rowData.entries) {
        if (entry.key.startsWith('dapan') && entry.key != 'dapan') {
          final answerIndex = entry.key.replaceFirst('dapan', '');
          final answerText = entry.value;
          if (answerText.isEmpty) {
            continue;
          }
          final correctKey = 'correct$answerIndex';
          final correctText = rowData[correctKey]?.toLowerCase() ?? rowData['ladapan$answerIndex']?.toLowerCase() ?? '';
          final isCorrect = correctText == '1' || correctText == 'true' || correctText == 'yes' || correctText == 'đúng';
          (question['DapAn'] as List).add({'NoiDung': answerText, 'LaDapAnDung': isCorrect});
        }
      }

      if ((question['DapAn'] as List).isEmpty && rowData.containsKey('dapan')) {
        final answerText = rowData['dapan'] ?? '';
        final correctText = rowData['ladapan']?.toLowerCase() ?? rowData['correct']?.toLowerCase() ?? '';
        final isCorrect = correctText == '1' || correctText == 'true' || correctText == 'yes' || correctText == 'đúng';
        if (answerText.isNotEmpty) {
          (question['DapAn'] as List).add({'NoiDung': answerText, 'LaDapAnDung': isCorrect});
        }
      }

      if (question['NoiDung'].toString().isNotEmpty && (question['DapAn'] as List).isNotEmpty) {
        questions.add(question);
      }
    }

    return questions;
  }

  Future<void> _showQuestionDetails(Map<String, dynamic> question) async {
    final answers = question['DapAn'] as List<dynamic>? ?? [];
    await showDialog<void>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Chi tiết câu hỏi'),
        content: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Nội dung: ${question['NoiDung'] ?? ''}'),
              const SizedBox(height: 10),
              Text('Mã bài học: ${question['MaBaiHoc'] ?? 'Không xác định'}'),
              const SizedBox(height: 10),
              Text('Loại câu hỏi: ${question['Loai'] ?? question['LoaiCauHoi'] ?? ''}'),
              const SizedBox(height: 14),
              const Text('Danh sách đáp án:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ...answers.map((answer) {
                final item = answer is Map ? Map<String, dynamic>.from(answer) : {'NoiDung': answer.toString(), 'LaDapAnDung': false};
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Icon(item['LaDapAnDung'] == true ? Icons.check_circle : Icons.circle_outlined, color: item['LaDapAnDung'] == true ? Colors.green : Colors.grey, size: 20),
                      const SizedBox(width: 10),
                      Expanded(child: Text(item['NoiDung']?.toString() ?? '')),
                    ],
                  ),
                );
              }).toList(),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Đóng')),
        ],
      ),
    );
  }

  Future<void> _showTestDialog({Map<String, dynamic>? test}) async {
    final titleController = TextEditingController(text: test?['TenBaiKiemTra']?.toString() ?? '');
    final durationController = TextEditingController(text: test?['ThoiLuong']?.toString() ?? '');
    String status = test?['TrangThai']?.toString() ?? 'draft';

    await showDialog<void>(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (dialogContext, dialogSetState) => AlertDialog(
          title: Text(test == null ? 'Thêm bài kiểm tra' : 'Sửa bài kiểm tra'),
          content: Column(mainAxisSize: MainAxisSize.min, children: [
            TextField(controller: titleController, decoration: const InputDecoration(labelText: 'Tên bài kiểm tra')),
            TextField(controller: durationController, decoration: const InputDecoration(labelText: 'Thời lượng')),
            DropdownButtonFormField<String>(
              value: status,
              decoration: const InputDecoration(labelText: 'Trạng thái'),
              items: const [
                DropdownMenuItem(value: 'draft', child: Text('Nháp')),
                DropdownMenuItem(value: 'published', child: Text('Đã xuất bản')),
              ],
              onChanged: (value) => dialogSetState(() => status = value ?? 'draft'),
            ),
          ]),
          actions: [
            TextButton(onPressed: () => Navigator.pop(dialogContext), child: const Text('Hủy')),
            ElevatedButton(
              onPressed: () async {
                final payload = {'TenBaiKiemTra': titleController.text.trim(), 'ThoiLuong': durationController.text.trim(), 'TrangThai': status};
                if (test == null) {
                  await AppDataService.addTest(payload);
                } else {
                  await AppDataService.updateTest(test['id'].toString(), payload);
                }
                if (!mounted) return;
                Navigator.pop(dialogContext);
                await _loadData();
              },
              child: const Text('Lưu'),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _deleteUser(Map<String, dynamic> user) async {
    await AppDataService.deleteUser(user['id'].toString());
    await _loadData();
  }

  Future<void> _deleteCategory(Map<String, dynamic> category) async {
    await AppDataService.deleteCategory(category['id'].toString());
    await _loadData();
  }

  Future<void> _deleteIntake(Map<String, dynamic> intake) async {
    await AppDataService.deleteIntake(intake['id'].toString());
    await _loadData();
  }

  Future<void> _deleteCourse(Map<String, dynamic> course) async {
    await AppDataService.deleteCourse(course['id'].toString());
    await _loadData();
  }

  Future<void> _deleteClass(Map<String, dynamic> classData) async {
    await AppDataService.deleteClass(classData['id'].toString());
    await _loadData();
  }

  Future<void> _deleteRegistration(Map<String, dynamic> registration) async {
    await AppDataService.deleteRegistration(registration['id'].toString());
    await _loadData();
  }

  Future<void> _deleteLesson(Map<String, dynamic> lesson) async {
    await AppDataService.deleteLesson(lesson['id'].toString());
    await _loadData();
  }

  Future<void> _deleteQuestion(Map<String, dynamic> question) async {
    await AppDataService.deleteQuestion(question['id'].toString());
    await _loadData();
  }

  Future<void> _deleteTest(Map<String, dynamic> test) async {
    await AppDataService.deleteTest(test['id'].toString());
    await _loadData();
  }
}

class _UserCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _UserCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['HoTen']?.toString() ?? 'Không tên'),
        subtitle: Text('${item['TenDangNhap'] ?? ''} • ${item['VaiTro'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _CategoryCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TenDanhMuc']?.toString() ?? 'Danh mục'),
        subtitle: Text(item['MoTa']?.toString() ?? ''),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _IntakeCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _IntakeCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TenDot']?.toString() ?? 'Đợt mới'),
        subtitle: Text('${item['NgayBatDau'] ?? ''} → ${item['NgayKetThuc'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _CourseCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _CourseCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TenKhoaHoc']?.toString() ?? 'Khóa học'),
        subtitle: Text('${item['TrinhDo'] ?? ''} • ${item['DanhMuc'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _ClassCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final List<Map<String, dynamic>> teachers;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _ClassCard({required this.item, required this.teachers, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    final teacherName = teachers.where((teacher) => teacher['id']?.toString() == item['MaGiaoVien']?.toString()).firstOrNull?['HoTen']?.toString() ?? 'Chưa phân công';
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TenLop']?.toString() ?? 'Lớp mới'),
        subtitle: Text('${item['MaKhoaHoc'] ?? ''} • $teacherName • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _RegistrationCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _RegistrationCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['HoTenHocVien']?.toString() ?? 'Học viên'),
        subtitle: Text('${item['TenKhoaHoc'] ?? ''} • ${item['TenLop'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _LessonCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _LessonCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TieuDe']?.toString() ?? 'Bài học mới'),
        subtitle: Text('${item['MaKhoaHoc'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _QuestionCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onTap;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _QuestionCard({required this.item, required this.onTap, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    final answers = item['DapAn'];
    final answerCount = answers is List ? answers.length : 0;
    final correctCount = answers is List
        ? answers.whereType<Map>().where((answer) => answer['LaDapAnDung'] == true || answer['isCorrect'] == true).length
        : 0;
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        onTap: onTap,
        title: Text(item['NoiDung']?.toString() ?? 'Câu hỏi'),
        subtitle: Text('${item['Loai'] ?? ''} • $answerCount đáp án • $correctCount đúng'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

class _TestCard extends StatelessWidget {
  final Map<String, dynamic> item;
  final VoidCallback onEdit;
  final VoidCallback onDelete;
  const _TestCard({required this.item, required this.onEdit, required this.onDelete});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(item['TenBaiKiemTra']?.toString() ?? 'Bài kiểm tra mới'),
        subtitle: Text('${item['ThoiLuong'] ?? ''} • ${item['TrangThai'] ?? ''}'),
        trailing: Row(mainAxisSize: MainAxisSize.min, children: [
          IconButton(icon: const Icon(Icons.edit), onPressed: onEdit),
          IconButton(icon: const Icon(Icons.delete, color: Colors.red), onPressed: onDelete),
        ]),
      ),
    );
  }
}

extension _FirstOrNull<E> on Iterable<E> {
  E? get firstOrNull => isEmpty ? null : first;
}
