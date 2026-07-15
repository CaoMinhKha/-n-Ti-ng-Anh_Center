import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class DictionaryScreen extends StatefulWidget {
  const DictionaryScreen({super.key});

  @override
  State<DictionaryScreen> createState() => _DictionaryScreenState();
}

class _DictionaryScreenState extends State<DictionaryScreen> {
  final _searchController = TextEditingController();
  Map<String, dynamic>? _wordData;
  bool _isLoading = false;

  Future<void> _searchWord(String word) async {
    if (word.isEmpty) return;
    setState(() => _isLoading = true);
    
    // Sử dụng Free Dictionary API để lấy dữ liệu thực tế
    final url = Uri.parse('https://api.dictionaryapi.dev/api/v2/entries/en/$word');
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() => _wordData = data[0]);
      } else {
        setState(() => _wordData = null);
        _showError('Không tìm thấy từ này!');
      }
    } catch (e) {
      _showError('Lỗi kết nối mạng!');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  void _showError(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg), backgroundColor: Colors.red));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      appBar: AppBar(
        title: const Text('Từ điển thông minh'),
        centerTitle: true,
      ),
      body: Column(
        children: [
          _buildSearchHeader(),
          Expanded(
            child: _isLoading 
              ? const Center(child: CircularProgressIndicator())
              : _wordData == null 
                ? _buildEmptyState()
                : _buildWordResult(),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchHeader() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(30)),
      ),
      child: TextField(
        controller: _searchController,
        decoration: InputDecoration(
          hintText: 'Nhập từ tiếng Anh...',
          prefixIcon: const Icon(Icons.search, color: Color(0xFF4B8AF7)),
          suffixIcon: IconButton(
            icon: const Icon(Icons.send_rounded, color: Color(0xFF4B8AF7)),
            onPressed: () => _searchWord(_searchController.text),
          ),
          filled: true,
          fillColor: Colors.blue.shade50,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(20), borderSide: BorderSide.none),
        ),
        onSubmitted: _searchWord,
      ),
    );
  }

  Widget _buildWordResult() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(24),
              boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(_wordData!['word'], style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF4B8AF7))),
                    IconButton(icon: const Icon(Icons.volume_up_rounded, color: Color(0xFF4B8AF7), size: 30), onPressed: () {}),
                  ],
                ),
                Text(_wordData!['phonetic'] ?? '', style: const TextStyle(color: Colors.grey, fontSize: 18)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          ...(_wordData!['meanings'] as List).map((m) => _buildMeaningSection(m)),
        ],
      ),
    );
  }

  Widget _buildMeaningSection(dynamic meaning) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(20)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(8)),
            child: Text(meaning['partOfSpeech'].toUpperCase(), style: const TextStyle(color: Colors.blue, fontWeight: FontWeight.bold, fontSize: 12)),
          ),
          const SizedBox(height: 12),
          Text(meaning['definitions'][0]['definition'], style: const TextStyle(fontSize: 16, height: 1.5)),
          if (meaning['definitions'][0]['example'] != null) ...[
            const SizedBox(height: 10),
            Text('Ex: ${meaning['definitions'][0]['example']}', style: const TextStyle(color: Colors.grey, fontStyle: FontStyle.italic)),
          ]
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_rounded, size: 80, color: Colors.grey.shade300),
          const SizedBox(height: 16),
          const Text('Bắt đầu tra cứu từ mới!', style: TextStyle(color: Colors.grey)),
        ],
      ),
    );
  }
}
