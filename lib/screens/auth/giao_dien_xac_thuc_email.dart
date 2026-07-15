import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_xac_thuc.dart';
import '../../duong_dan/duong_dan.dart';

class VerifyEmailScreen extends StatefulWidget {
  final String email;
  const VerifyEmailScreen({super.key, required this.email});

  @override
  State<VerifyEmailScreen> createState() => _VerifyEmailScreenState();
}

class _VerifyEmailScreenState extends State<VerifyEmailScreen> {
  final List<TextEditingController> _controllers = List.generate(6, (_) => TextEditingController());
  final List<FocusNode> _focusNodes = List.generate(6, (_) => FocusNode());
  bool _isLoading = false;

  Future<void> _handleVerify() async {
    String otp = _controllers.map((c) => c.text).join();
    if (otp.length < 6) {
      _showSnackBar('Vui lòng nhập đủ 6 mã số');
      return;
    }

    setState(() => _isLoading = true);
    try {
      final result = await AuthService.verifyEmail(widget.email, otp);
      if (result['status'] == true || result['message'] == 'Xác thực email thành công') {
        _showSnackBar('Xác thực thành công! Hãy đăng nhập.', isSuccess: true);
        Navigator.pushNamedAndRemoveUntil(context, AppRoutes.login, (route) => false);
      } else {
        _showSnackBar(result['error'] ?? 'Mã OTP không chính xác');
      }
    } catch (e) {
      _showSnackBar('Lỗi: $e');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showSnackBar(String msg, {bool isSuccess = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(msg),
        backgroundColor: isSuccess ? Colors.green : Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Xác thực Email'), elevation: 0),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(30),
        child: Column(
          children: [
            const Icon(Icons.mark_email_read_outlined, size: 80, color: Color(0xFF4B8AF7)),
            const SizedBox(height: 20),
            Text(
              'Nhập mã OTP đã được gửi tới\n${widget.email}',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 16),
            ),
            const SizedBox(height: 40),
          Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(
                6,
                (index) => Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 6),
                  child: _buildOtpBox(index),
                ),
              ),
            ),
            const SizedBox(height: 40),
            _isLoading
                ? const CircularProgressIndicator()
                : ElevatedButton(
                    onPressed: _handleVerify,
                    child: const Text('XÁC THỰC'),
                  ),
            const SizedBox(height: 20),
            TextButton(
              onPressed: () => AuthService.resendOtp(widget.email),
              child: const Text('Gửi lại mã OTP'),
            ),
          ],
        ),
      ),
    );
  }
Widget _buildOtpBox(int index) {
  return SizedBox(
    width: 60,
    height: 70,
    child: TextField(
      controller: _controllers[index],
      focusNode: _focusNodes[index],
      keyboardType: TextInputType.number,
      textAlign: TextAlign.center,
      maxLength: 1,

      style: const TextStyle(
        fontSize: 28,
        color: Colors.black,
        fontWeight: FontWeight.bold,
      ),

      cursorColor: Colors.blue,

      decoration: InputDecoration(
        counterText: "",
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(vertical: 15),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
      ),

     onChanged: (value) {
  // Chỉ giữ 1 ký tự cuối cùng
  if (value.length > 1) {
    _controllers[index].text = value.substring(value.length - 1);
    _controllers[index].selection = TextSelection.fromPosition(
      TextPosition(offset: _controllers[index].text.length),
    );
  }

  // Nhập xong -> sang ô tiếp theo
  if (value.isNotEmpty) {
    if (index < 5) {
      FocusScope.of(context).requestFocus(_focusNodes[index + 1]);
    } else {
      FocusScope.of(context).unfocus();
    }
  }

  // Xóa -> quay lại ô trước
  if (value.isEmpty && index > 0) {
    _controllers[index - 1].clear();
    FocusScope.of(context).requestFocus(_focusNodes[index - 1]);
  }
},
    ),
  );
}
}
