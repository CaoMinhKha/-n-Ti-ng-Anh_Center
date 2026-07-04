import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';

class StudentClassListScreen extends StatefulWidget {
  const StudentClassListScreen({super.key});

  @override
  State<StudentClassListScreen> createState() => _StudentClassListScreenState();
}

class _StudentClassListScreenState extends State<StudentClassListScreen> {
  List classes = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadClasses();
  }

  Future<void> loadClasses() async {
    final data = await ClassService.getClasses();
    if (mounted) {
      setState(() {
        classes = data;
        loading = false;
      });
    }
  }

  String _formatSchedule(List<dynamic> schedules) {
    if (schedules.isEmpty) return 'Chưa có lịch học';
    
    final dayMap = {
      2: 'Thứ 2', 3: 'Thứ 3', 4: 'Thứ 4', 5: 'Thứ 5',
      6: 'Thứ 6', 7: 'Thứ 7', 8: 'Chủ nhật'
    };

    final days = <String>[];
    final times = <String>[];
    
    for (final schedule in schedules) {
      final thu = schedule['ThuHoc'] ?? 0;
      
      if (dayMap.containsKey(thu)) {
        days.add(dayMap[thu]!);
      }
      
      final gioBatDau = schedule['GioBatDau'] ?? '';
      final gioKetThuc = schedule['GioKetThuc'] ?? '';
      final timeStr = '$gioBatDau - $gioKetThuc';
      
      if (!times.contains(timeStr)) {
        times.add(timeStr);
      }
    }

    final dayStr = days.isNotEmpty ? days.join(', ') : 'Chưa xác định';
    final timeStr = times.isNotEmpty ? times.join(' / ') : '';
    
    return '$dayStr: $timeStr';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Danh sách lớp học'),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : classes.isEmpty
              ? const Center(child: Text('Không có lớp học nào'))
              : ListView.builder(
                  itemCount: classes.length,
                  itemBuilder: (context, index) {
                    final item = classes[index];
                    final schedules = item['LichHoc'] as List? ?? [];
                    final soChoConLai = item['SoChoConLai'] as int? ?? 0;
                    
                    return Card(
                      margin: const EdgeInsets.all(10),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(item['TenLop'] ?? 'Lớp chưa tên', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                            const SizedBox(height: 6),
                            Text('Khóa: ${item['MaKhoaHoc'] ?? ''} • GV: ${item['MaGiaoVien'] ?? 'Chưa phân công'}'),
                            const SizedBox(height: 6),
                            Text('Lịch: ${_formatSchedule(schedules)}'),
                            const SizedBox(height: 6),
                            Text('Còn $soChoConLai chỗ trống', 
                              style: TextStyle(
                                color: soChoConLai > 0 ? Colors.green : Colors.red,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
    );
  }
}
