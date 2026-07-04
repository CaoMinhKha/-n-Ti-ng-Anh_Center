import 'package:flutter/material.dart';

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});

  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  final TextEditingController _controller = TextEditingController();
  bool _loading = false;
  String _result = '';

  Future<void> _searchWord() async {
    final word = _controller.text.trim();
    if (word.isEmpty) return;
    setState(() => _loading = true);
    await Future.delayed(const Duration(milliseconds: 600));
    setState(() {
      _result = '"$word"\n\nMeaning: a word or phrase used to describe a thing or express a thought.\n\nExample: I love learning English every day.';
      _loading = false;
    });
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
