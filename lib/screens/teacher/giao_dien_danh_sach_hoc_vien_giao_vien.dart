import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';

class TeacherStudentListScreen extends StatefulWidget {
  final int? classId;
  final String? className;
  const TeacherStudentListScreen({super.key, this.classId, this.className});

  @override
  State<TeacherStudentListScreen> createState() => _TeacherStudentListScreenState();
}

class _TeacherStudentListScreenState extends State<TeacherStudentListScreen> {
  List<Map<String, dynamic>> students = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadStudents();
  }

  Future<void> loadStudents() async {
    setState(() => loading = true);
    final data = await AppDataService.getClassStudents(widget.classId ?? 0);
    setState(() {
      students = data;
      loading = false;
    });
  }

  // Thực hiện điểm danh thật qua API
  Future<void> _submitAttendance(int studentId, String status) async {
    try {
      await AppDataService.markAttendance({
        'HocVienID': studentId,
        'BuoiHocID': 1, // Giả định buổi học hiện tại
        'TrangThaiDiemDanh': status,
      });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã cập nhật điểm danh')));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  // Nhập điểm thật qua API
  Future<void> _submitGrade(int studentId, double grade, String type) async {
    try {
      await AppDataService.updateGrade({
        'HocVienID': studentId,
        'LopHocID': widget.classId,
        type: grade, // DiemBaiTap hoặc DiemKiemTra
      });
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Đã lưu điểm thành công')));
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Lỗi: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: Text(widget.className ?? 'Danh sách học viên'),
        centerTitle: true,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : students.isEmpty
              ? const Center(child: Text('Chưa có học viên trong lớp này'))
              : ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: students.length,
                  itemBuilder: (context, index) => _buildStudentCard(students[index]),
                ),
    );
  }

  Widget _buildStudentCard(Map<String, dynamic> student) {
    final account = student['taikhoan'] ?? {};
    final studentId = student['HocVienID'];

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Column(
        children: [
          ListTile(
            contentPadding: const EdgeInsets.all(16),
            leading: const CircleAvatar(
              backgroundColor: Color(0xFFF0F4FF),
              child: Icon(Icons.person, color: Color(0xFF4B8AF7)),
            ),
            title: Text(account['hoVaTen'] ?? 'Học viên', style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(account['email'] ?? ''),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Row(
              children: [
                _actionBtn(Icons.how_to_reg, 'ĐIỂM DANH', Colors.orange, () => _showAttendanceDialog(studentId)),
                const SizedBox(width: 10),
                _actionBtn(Icons.edit_note, 'NHẬP ĐIỂM', Colors.blue, () => _showGradeDialog(studentId)),
                const SizedBox(width: 10),
                _actionBtn(Icons.bar_chart, 'TIẾN ĐỘ', Colors.green, () {}),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _actionBtn(IconData icon, String label, Color color, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(color: color.withOpacity(0.08), borderRadius: BorderRadius.circular(12)),
          child: Column(
            children: [
              Icon(icon, color: color, size: 18),
              const SizedBox(height: 4),
              Text(label, style: TextStyle(color: color, fontSize: 9, fontWeight: FontWeight.bold)),
            ],
          ),
        ),
      ),
    );
  }

  void _showAttendanceDialog(int studentId) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(30))),
      builder: (_) => Container(
        padding: const EdgeInsets.all(30),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Cập nhật điểm danh', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 20),
            Row(
              children: [
                _attendanceOption('CÓ MẶT', Icons.check_circle, Colors.green, () => _submitAttendance(studentId, 'CO_MAT')),
                _attendanceOption('VẮNG', Icons.cancel, Colors.red, () => _submitAttendance(studentId, 'VANG_KHONG_PHEP')),
                _attendanceOption('MUỘN', Icons.access_time_filled, Colors.orange, () => _submitAttendance(studentId, 'DI_MUON')),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _attendanceOption(String label, IconData icon, Color color, VoidCallback onTap) {
    return Expanded(
      child: InkWell(
        onTap: () { Navigator.pop(context); onTap(); },
        child: Column(
          children: [
            Icon(icon, color: color, size: 40),
            const SizedBox(height: 8),
            Text(label, style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 12)),
          ],
        ),
      ),
    );
  }

  void _showGradeDialog(int studentId) {
    final gradeController = TextEditingController();
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Nhập điểm cho học viên'),
        content: TextField(
          controller: gradeController,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Số điểm (0-10)', border: OutlineInputBorder()),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('HỦY')),
          ElevatedButton(
            onPressed: () {
              final grade = double.tryParse(gradeController.text) ?? 0;
              _submitGrade(studentId, grade, 'DiemBaiTap');
              Navigator.pop(context);
            }, 
            child: const Text('LƯU ĐIỂM')
          ),
        ],
      ),
    );
  }
}
