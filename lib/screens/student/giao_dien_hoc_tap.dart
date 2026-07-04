import 'package:flutter/material.dart';

class StudyScreen extends StatelessWidget {
  const StudyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final lessons = [
      {'title': 'Lesson 1: Hello!', 'subtitle': 'Greeting and introductions', 'icon': Icons.volume_up},
      {'title': 'Lesson 2: Daily routines', 'subtitle': 'Speaking and listening', 'icon': Icons.record_voice_over},
      {'title': 'Lesson 3: Shopping', 'subtitle': 'Vocabulary and role-play', 'icon': Icons.shopping_bag},
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Bài học hôm nay')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: lessons.length,
        itemBuilder: (context, index) {
          final item = lessons[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: ListTile(
              leading: CircleAvatar(child: Icon(item['icon'] as IconData)),
              title: Text(item['title'] as String),
              subtitle: Text(item['subtitle'] as String),
              trailing: const Icon(Icons.arrow_forward_ios),
            ),
          );
        },
      ),
    );
  }
}
