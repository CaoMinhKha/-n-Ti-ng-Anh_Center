import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});

  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  final TextEditingController _controller = TextEditingController();
  bool _loading = false;
  String _result = '';
  String _errorMessage = '';

  Future<void> _searchWord() async {
    final word = _controller.text.trim();
    if (word.isEmpty) return;

    setState(() {
      _loading = true;
      _result = '';
      _errorMessage = '';
    });

    try {
      final encodedWord = Uri.encodeComponent(word);
      final uri = Uri.parse('https://api.dictionaryapi.dev/api/v2/entries/en/$encodedWord');
      final response = await http.get(uri);

      if (response.statusCode != 200) {
        throw Exception('Không tìm thấy từ này hoặc API tạm thời không khả dụng.');
      }

      final decoded = jsonDecode(response.body);
      if (decoded is! List || decoded.isEmpty) {
        throw Exception('Không có dữ liệu cho từ này.');
      }

      final entry = Map<String, dynamic>.from(decoded.first as Map);
      final buffer = StringBuffer();
      buffer.writeln('Word: ${entry['word'] ?? word}');

      final phonetic = entry['phonetic']?.toString();
      if (phonetic != null && phonetic.isNotEmpty) {
        buffer.writeln('Phonetic: $phonetic');
      }

      final meanings = entry['meanings'];
      if (meanings is List && meanings.isNotEmpty) {
        for (final meaning in meanings) {
          if (meaning is! Map) continue;
          final meaningMap = Map<String, dynamic>.from(meaning);
          final partOfSpeech = meaningMap['partOfSpeech']?.toString();
          if (partOfSpeech != null && partOfSpeech.isNotEmpty) {
            buffer.writeln('\nPart of speech: $partOfSpeech');
          }

          final definitions = meaningMap['definitions'];
          if (definitions is List) {
            for (var index = 0; index < definitions.length; index++) {
              final definitionItem = definitions[index];
              if (definitionItem is! Map) continue;
              final definitionMap = Map<String, dynamic>.from(definitionItem);
              final definition = definitionMap['definition']?.toString() ?? '';
              if (definition.isNotEmpty) {
                buffer.writeln('${index + 1}. $definition');
              }
              final example = definitionMap['example']?.toString();
              if (example != null && example.isNotEmpty) {
                buffer.writeln('   Example: $example');
              }
            }
          }
        }
      }

      setState(() {
        _result = buffer.toString().trim();
      });
    } catch (e) {
      setState(() {
        _errorMessage = e.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tra từ tiếng Anh')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: _controller,
              decoration: InputDecoration(
                hintText: 'Nhập từ tiếng Anh...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onSubmitted: (_) => _searchWord(),
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: _searchWord,
                icon: const Icon(Icons.translate),
                label: const Text('Tra từ'),
              ),
            ),
            const SizedBox(height: 16),
            if (_loading) const CircularProgressIndicator(),
            if (_errorMessage.isNotEmpty)
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: SingleChildScrollView(
                      child: Text(_errorMessage, style: const TextStyle(fontSize: 16, height: 1.5, color: Colors.red)),
                    ),
                  ),
                ),
              ),
            if (_result.isNotEmpty)
              Expanded(
                child: Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: SingleChildScrollView(
                      child: Text(_result, style: const TextStyle(fontSize: 16, height: 1.5)),
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
