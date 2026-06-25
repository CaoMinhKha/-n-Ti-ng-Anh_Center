import 'package:shared_preferences/shared_preferences.dart';

class UserSession {

  static Future<void> saveUser(int maHV) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt("MaHocVien", maHV);
  }

  static Future<int?> getMaHocVien() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt("MaHocVien");
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}