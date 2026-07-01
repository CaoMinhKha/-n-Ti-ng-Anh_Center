import 'package:shared_preferences/shared_preferences.dart';

class UserSession {

  static Future<void> saveUser(int maHV) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setInt("MaHocVien", maHV);
  }

  static Future<void> saveUserRole(String role) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("userRole", role);
  }

  static Future<void> saveUserName(String name) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString("userName", name);
  }

  static Future<int?> getMaHocVien() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt("MaHocVien");
  }

  static Future<String?> getUserRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("userRole");
  }

  static Future<String?> getUserName() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString("userName");
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }
}