import 'package:flutter/material.dart';

class StudyScreen extends StatelessWidget {
  const StudyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final lessons = [
      {
        "title": "Lesson 1: Hello!",
        "subtitle": "Greeting and introductions",
        "progress": 80,
        "icon": Icons.volume_up,
      },
      {
        "title": "Lesson 2: Daily routines",
        "subtitle": "Speaking and listening",
        "progress": 50,
        "icon": Icons.record_voice_over,
      },
      {
        "title": "Lesson 3: Shopping",
        "subtitle": "Vocabulary and role-play",
        "progress": 20,
        "icon": Icons.shopping_bag,
      },
    ];

    return Scaffold(
      backgroundColor: Colors.grey[100],

      appBar: AppBar(
        title: const Text("Bài học hôm nay"),
        centerTitle: true,
      ),

      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [

          // HEADER
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.blue,
              borderRadius: BorderRadius.circular(20),
            ),

            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [

                const Text(
                  "Xin chào Kha ",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),

                const SizedBox(height: 8),

                const Text(
                  "Tiếp tục học tiếng Anh hôm nay",
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),

                const SizedBox(height: 20),

                LinearProgressIndicator(
                  value: 0.65,
                  minHeight: 8,
                  borderRadius: BorderRadius.circular(10),
                  backgroundColor: Colors.white54,
                ),

                const SizedBox(height: 8),

                const Text(
                  "Đã hoàn thành 65%",
                  style: TextStyle(
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 25),
          const Text(
            "Khóa học hiện tại",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          Card(
            child: ListTile(
              leading: const CircleAvatar(
                child: Icon(Icons.school),
              ),
              title: const Text(
                "English Basic A1",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                ),
              ),
              subtitle: const Text(
                "30 bài học - 10 bài kiểm tra",
              ),
              trailing: ElevatedButton(
                onPressed: () {},
                child: const Text("Vào học"),
              ),
            ),
          ),
          const SizedBox(height: 25),
          const Text(
            "Danh sách bài học",
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 10),
          ...lessons.map(
            (lesson) {
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(15),

                  child: Column(
                    children: [
                      Row(
                        children: [

                          CircleAvatar(
                            radius: 28,
                            child: Icon(
                              lesson["icon"] as IconData,
                            ),
                          ),
                          const SizedBox(width: 15),
                          Expanded(
                            child: Column(
                              crossAxisAlignment:
                                  CrossAxisAlignment.start,
                              children: [
                                Text(
                                  lesson["title"].toString(),
                                  style: const TextStyle(
                                    fontSize: 18,
                                    fontWeight:
                                        FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  lesson["subtitle"].toString(),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 15),
                      LinearProgressIndicator(
                        value:
                            (lesson["progress"] as int) / 100,
                        minHeight: 8,
                        borderRadius:
                            BorderRadius.circular(10),
                      ),
                      const SizedBox(height: 10),
                      Align(
                        alignment: Alignment.centerRight,

                        child: ElevatedButton.icon(

                          icon: const Icon(
                            Icons.play_arrow,
                          ),

                          label: const Text(
                            "Học ngay",
                          ),

                          onPressed: () {

                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) =>
                                    LessonScreen(
                                      title:
                                          lesson["title"]
                                              .toString(),
                                    ),
                              ),
                            );
                          },
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
    );
  }
}

class LessonScreen extends StatelessWidget {

  final String title;

  const LessonScreen({
    super.key,
    required this.title,
  });
  @override
  Widget build(BuildContext context) {

    return Scaffold(

      appBar: AppBar(
        title: Text(title),
      ),

      body: const Center(

        child: Text(
          "Nội dung bài học",
          style: TextStyle(
            fontSize: 22,
          ),
        ),

      ),
    );
  }
}