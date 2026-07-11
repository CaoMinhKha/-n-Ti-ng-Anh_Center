import 'package:flutter/material.dart';

class StudentCourseExplorerScreen extends StatelessWidget {
  const StudentCourseExplorerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final courses = [
      {
        "title": "Tiếng Anh A1",
        "teacher": "Nguyễn Văn A",
        "level": "Cơ bản",
        "time": "3 tháng",
        "students": "35 học viên",
        "schedule": "T2 - T4 - T6",
        "color": Colors.blue,
        "icon": Icons.school,
      },
      {
        "title": "Tiếng Anh A2",
        "teacher": "Trần Thị B",
        "level": "Sơ cấp",
        "time": "4 tháng",
        "students": "28 học viên",
        "schedule": "T3 - T5 - T7",
        "color": Colors.green,
        "icon": Icons.language,
      },
      {
        "title": "Tiếng Anh A3",
        "teacher": "Lê Văn C",
        "level": "Trung cấp",
        "time": "5 tháng",
        "students": "40 học viên",
        "schedule": "Thứ 7 - CN",
        "color": Colors.orange,
        "icon": Icons.menu_book,
      },
    ];
    return Scaffold(
      backgroundColor: const Color(0xffF4F7FB),

      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 0,
        title: const Text("Khám phá khóa học"),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
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
                    "Chào mừng bạn ",
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 18,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    "Hãy chọn khóa học phù hợp",
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
                      hintText: "Tìm kiếm khóa học...",
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
                  chip("Tất cả"),
                  chip("A1"),
                  chip("A2"),
                  chip("A3"),
                  chip("Khóa luyện thi 2/6"),
                  chip("IELTS"),
                  chip("TOEIC"),
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
                final course = courses[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: const [

                      BoxShadow(
                        blurRadius: 10,
                        color: Colors.black12,
                        offset: Offset(0,4),
                      )
                    ],
                  ),
                  child: Column(
                    children: [

                      Container(
                        height: 130,
                        decoration: BoxDecoration(
                          color: course["color"] as Color,
                          borderRadius: const BorderRadius.only(
                            topLeft: Radius.circular(20),
                            topRight: Radius.circular(20),
                          ),
                        ),

                        child: Center(
                          child: Icon(
                            course["icon"] as IconData,
                            size: 65,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    course["title"].toString(),
                                    style: const TextStyle(
                                      fontSize: 22,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 10,
                                      vertical: 5),
                                  decoration: BoxDecoration(
                                    color: Colors.orange.shade100,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Text(
                                    course["level"].toString(),
                                  ),
                                )
                              ],
                            ),
                            const SizedBox(height: 15),
                            Row(
                              children: [
                                const Icon(Icons.person,color: Colors.blue),
                                const SizedBox(width: 8),
                                Text(course["teacher"].toString()),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Icon(Icons.access_time,color: Colors.green),
                                const SizedBox(width: 8),
                                Text(course["time"].toString()),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Icon(Icons.people,color: Colors.orange),
                                const SizedBox(width: 8),
                                Text(course["students"].toString()),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Icon(Icons.calendar_today,color: Colors.red),
                                const SizedBox(width: 8),
                                Text(course["schedule"].toString()),
                              ],
                            ),
                            const SizedBox(height: 20),
                            SizedBox(
                              width: double.infinity,
                              height: 50,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor:
                                  course["color"] as Color,
                                  shape: RoundedRectangleBorder(
                                    borderRadius:
                                    BorderRadius.circular(15),
                                  ),
                                ),
                                onPressed: () {
                                },
                                icon: const Icon(Icons.check_circle),
                                label: const Text(
                                  "Đăng ký ngay",
                                  style: TextStyle(
                                    fontSize: 18,
                                  ),
                                ),
                              ),
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                );
              },
            )
          ],
        ),
      ),
    );
  }
  static Widget chip(String text) {
    return Container(
      margin: const EdgeInsets.only(right: 10),
      child: Chip(
        label: Text(text),
        backgroundColor: Colors.white,
        elevation: 3,
      ),
    );
  }
}