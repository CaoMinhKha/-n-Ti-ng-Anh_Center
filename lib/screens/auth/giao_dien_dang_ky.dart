import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../dich_vu/dich_vu_xac_thuc.dart';
import 'giao_dien_xac_thuc_email.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  DateTime? _selectedDate;
  String _selectedGender = 'NAM';
  bool _isLoading = false;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime(2000),
      firstDate: DateTime(1950),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() => _selectedDate = picked);
    }
  }

  Future<void> _handleRegister() async {
    if (_nameController.text.isEmpty || _emailController.text.isEmpty || _passwordController.text.isEmpty || _selectedDate == null) {
      _showSnackBar('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setState(() => _isLoading = true);
    try {
      // Fix lỗi gọi register truyền Map data
      final result = await AuthService.register({
        'email': _emailController.text.trim(),
        'password': _passwordController.text.trim(),
        'hoVaTen': _nameController.text.trim(),
        'ngaySinh': _selectedDate!.toIso8601String(),
        'gioiTinh': _selectedGender,
      });

      if (!mounted) return;

      if (result['status'] == true || result['userId'] != null) {
        _showSnackBar('Đăng ký thành công! Vui lòng kiểm tra mã OTP');
        Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => VerifyEmailScreen(email: _emailController.text.trim())),
        );
      } else {
        _showSnackBar(result['error'] ?? 'Đăng ký thất bại');
      }
    } catch (e) {
      _showSnackBar('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng ký tài khoản')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: _nameController, decoration: const InputDecoration(labelText: 'Họ và tên')),
            TextField(controller: _emailController, decoration: const InputDecoration(labelText: 'Email')),
            TextField(controller: _passwordController, obscureText: true, decoration: const InputDecoration(labelText: 'Mật khẩu')),
            const SizedBox(height: 20),
            ListTile(
              title: Text(_selectedDate == null ? 'Chọn ngày sinh' : DateFormat('dd/MM/yyyy').format(_selectedDate!)),
              trailing: const Icon(Icons.calendar_today),
              onTap: () => _selectDate(context),
            ),
            DropdownButton<String>(
              value: _selectedGender,
              isExpanded: true,
              items: const [
                DropdownMenuItem(value: 'NAM', child: Text('Nam')),
                DropdownMenuItem(value: 'NU', child: Text('Nữ')),
              ],
              onChanged: (val) => setState(() => _selectedGender = val!),
            ),
            const SizedBox(height: 30),
            _isLoading 
              ? const CircularProgressIndicator()
              : ElevatedButton(onPressed: _handleRegister, child: const Text('ĐĂNG KÝ')),
          ],
        ),
      ),
    );
  }
}
