import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_khoa_hoc.dart';
import '../student/giao_dien_chi_tiet_khoa_hoc.dart';
import '../student/giao_dien_dang_ky_khoa_hoc.dart';

class StudentCourseExplorerScreen extends StatefulWidget {
  const StudentCourseExplorerScreen({super.key});

  @override
  State<StudentCourseExplorerScreen> createState() => _StudentCourseExplorerScreenState();
}

class _StudentCourseExplorerScreenState extends State<StudentCourseExplorerScreen> {
  List courses = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadCourses();
  }

  Future<void> loadCourses() async {
    final data = await CourseService.getCourses();
    if (!mounted) return;
    setState(() {
      courses = data;
      loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xffF4F7FB),
      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 0,
        title: const Text('Khám phá khóa học'),
        centerTitle: true,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Column(
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    decoration: const BoxDecoration(
                      color: Colors.blue,
                      borderRadius: BorderRadius.only(
                        bottomLeft: Radius.circular(30),
                        bottomRight: Radius.circular(30),
                      ),
                    ),
                    child: const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Chào mừng bạn',
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 18,
                          ),
                        ),
                        SizedBox(height: 10),
                        Text(
                          'Hãy chọn khóa học phù hợp',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 25,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 20),
                        TextField(
                          decoration: InputDecoration(
                            filled: true,
                            fillColor: Colors.white,
                            hintText: 'Tìm kiếm khóa học...',
                            prefixIcon: Icon(Icons.search),
                            border: OutlineInputBorder(
                              borderSide: BorderSide.none,
                              borderRadius: BorderRadius.all(
                                Radius.circular(15),
                              ),
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  SizedBox(
                    height: 45,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 15),
                      children: [
                        chip('Tất cả'),
                        chip('A1'),
                        chip('A2'),
                        chip('A3'),
                        chip('Luyện thi'),
                        chip('IELTS'),
                        chip('TOEIC'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  ListView.builder(
                    itemCount: courses.length,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    padding: const EdgeInsets.symmetric(horizontal: 15),
                    itemBuilder: (context, index) {
                      final course = courses[index] as Map<String, dynamic>;
                      final title = course['TenKhoaHoc']?.toString() ?? 'Khóa học';
                      final level = course['TrinhDo']?.toString() ?? 'Chưa xác định';
                      final description = course['MoTa']?.toString() ?? '';
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (_) => CourseDetailScreen(course: Map<String, dynamic>.from(course)),
                            ),
                          );
                        },
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 20),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            boxShadow: const [
                              BoxShadow(
                                blurRadius: 10,
                                color: Colors.black12,
                                offset: Offset(0, 4),
                              )
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                height: 120,
                                decoration: BoxDecoration(
                                  color: Colors.blue.shade400,
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(20),
                                    topRight: Radius.circular(20),
                                  ),
                                ),
                                child: Center(
                                  child: Icon(
                                    Icons.school,
                                    size: 55,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Expanded(
                                          child: Text(
                                            title,
                                            style: const TextStyle(
                                              fontSize: 20,
                                              fontWeight: FontWeight.bold,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                          decoration: BoxDecoration(
                                            color: Colors.orange.shade100,
                                            borderRadius: BorderRadius.circular(20),
                                          ),
                                          child: Text(level),
                                        ),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Text(
                                      description,
                                      maxLines: 3,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(color: Colors.black87),
                                    ),
                                    const SizedBox(height: 16),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('Khóa học: $title'),
                                        ElevatedButton(
                                          onPressed: () {
                                            Navigator.push(
                                              context,
                                              MaterialPageRoute(
                                                builder: (_) => StudentCourseScreen(),
                                              ),
                                            );
                                          },
                                          child: const Text('Xem khóa học'),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
    );
  }

  static Widget chip(String text) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.blue.shade100),
      ),
      child: Text(text),
    );
  }
}
