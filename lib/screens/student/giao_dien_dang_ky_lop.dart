import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_lop_hoc.dart';
import '../../dich_vu/dich_vu_dang_ky_hoc_vien.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class RegisterClassScreen extends StatefulWidget {
  final int? maKhoaHoc;
  final String? courseName;

  const RegisterClassScreen({super.key, this.maKhoaHoc, this.courseName});

  @override
  State<RegisterClassScreen> createState() => _RegisterClassScreenState();
}

class _RegisterClassScreenState extends State<RegisterClassScreen> {
  List classes = [];
  bool loading = true;

  @override
  void initState() {
    super.initState();
    loadClasses();
  }

  String _normalizeCourseName(String? value) {
    final normalized = (value ?? '').toLowerCase().trim();
    if (normalized.isEmpty) return '';

    return normalized
        .replaceAll(RegExp(r'\s+'), ' ')
        .replaceAll(RegExp(r'\s*-\s*(sáng|chiều|tối|morning|afternoon|evening)\s*$'), '');
  }

  bool _matchesCourse(Map<String, dynamic> item) {
    final maKhoaHocValue = item['MaKhoaHoc']?.toString() ?? '';
    if (widget.maKhoaHoc != null && maKhoaHocValue == widget.maKhoaHoc.toString()) {
      return true;
    }

    final className = item['TenLop']?.toString() ?? '';
    final normalizedClassName = _normalizeCourseName(className);
    final normalizedCourseName = _normalizeCourseName(widget.courseName);

    if (normalizedCourseName.isNotEmpty && normalizedClassName.contains(normalizedCourseName)) {
      return true;
    }

    return widget.maKhoaHoc == null;
  }

  Future<void> loadClasses() async {
    final token = await UserSession.getToken();
    final data = await ClassService.getClasses(token: token);
    final filtered = <Map<String, dynamic>>[];

    if (widget.maKhoaHoc != null) {
      filtered.addAll(data.where((item) => item['MaKhoaHoc']?.toString() == widget.maKhoaHoc.toString()).cast<Map<String, dynamic>>());
    } else {
      filtered.addAll(data.where((item) => _matchesCourse(item as Map<String, dynamic>)).cast<Map<String, dynamic>>());
    }

    if (widget.maKhoaHoc != null) {
      final existingMaLop = filtered.map((item) => item['MaLop']?.toString()).toSet();
      final fallbackClasses = ClassService.buildFallbackClasses();
      for (final item in fallbackClasses) {
        if (item['MaKhoaHoc']?.toString() == widget.maKhoaHoc.toString()) {
          final maLop = item['MaLop']?.toString();
          if (maLop != null && !existingMaLop.contains(maLop)) {
            filtered.add(item);
          }
        }
      }
    }

    filtered.sort((a, b) {
      final shiftOrder = {'morning': 0, 'afternoon': 1, 'evening': 2};
      final aShift = (a['LichHoc'] as List<dynamic>?)?.first['Buoi']?.toString() ?? 'morning';
      final bShift = (b['LichHoc'] as List<dynamic>?)?.first['Buoi']?.toString() ?? 'morning';
      return (shiftOrder[aShift] ?? 0).compareTo(shiftOrder[bShift] ?? 0);
    });

    if (mounted) {
      setState(() {
        classes = filtered;
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

    final days = <String>{};
    final specificDates = <String>{};

    for (final schedule in schedules) {
      final thu = schedule['ThuHoc'];
      if (thu is int && dayMap.containsKey(thu)) {
        days.add(dayMap[thu]!);
      }
      final ngayHoc = schedule['NgayHoc']?.toString().trim();
      if (ngayHoc != null && ngayHoc.isNotEmpty) {
        specificDates.add(ngayHoc);
      }
    }

    if (specificDates.isNotEmpty) {
      return specificDates.join(', ');
    }
    return days.isNotEmpty ? days.join(', ') : 'Chưa xác định';
  }

  String _formatTime(List<dynamic> schedules) {
    if (schedules.isEmpty) return '';
    
    final schedule = schedules.first;
    final gioBatDau = schedule['GioBatDau']?.toString().trim() ?? '';
    final gioKetThuc = schedule['GioKetThuc']?.toString().trim() ?? '';
    
    if (gioBatDau.isEmpty && gioKetThuc.isEmpty) return 'Chưa xác định';
    return '$gioBatDau - $gioKetThuc';
  }

  String _formatStartDate(Map<String, dynamic> item) {
    final ngayKhaiGiang = item['NgayKhaiGiang']?.toString().trim();
    if (ngayKhaiGiang != null && ngayKhaiGiang.isNotEmpty) {
      return ngayKhaiGiang;
    }

    final schedules = item['LichHoc'] as List? ?? [];
    for (final schedule in schedules) {
      final ngayHoc = schedule['NgayHoc']?.toString().trim();
      if (ngayHoc != null && ngayHoc.isNotEmpty) {
        return ngayHoc;
      }
    }

    return 'Chưa có ngày cụ thể';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F6FB),
      appBar: AppBar(
        title: Text(widget.courseName != null && widget.courseName!.isNotEmpty
            ? 'Lớp của ${widget.courseName}'
            : 'Đăng ký lớp học'),
        backgroundColor: const Color(0xFF5E35B1),
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : classes.isEmpty
              ? const Center(child: Text('Không có lớp học nào'))
              : ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: classes.length,
                  itemBuilder: (context, index) {
                    final item = classes[index];
                    final schedules = item['LichHoc'] as List? ?? [];
                    final soChoConLai = item['SoChoConLai'] as int? ?? 0;
                    
                    final shift = schedules.isNotEmpty 
                        ? (schedules.first['Buoi'] ?? 'morning')
                        : 'morning';
                    final shiftText = shift == 'morning' ? 'Sáng' : 
                                     shift == 'afternoon' ? 'Chiều' : 'Tối';
                    
                    return Card(
                      color: Colors.white,
                      elevation: 4,
                      margin: const EdgeInsets.only(bottom: 18),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                      child: Padding(
                        padding: const EdgeInsets.all(18),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF5E35B1),
                                    borderRadius: BorderRadius.circular(999),
                                    boxShadow: [
                                      const BoxShadow(
                                        color: Color.fromRGBO(0, 0, 0, 0.08),
                                        blurRadius: 6,
                                        offset: Offset(0, 3),
                                      ),
                                    ],
                                  ),
                                  child: Text(
                                    shiftText,
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                      letterSpacing: 0.3,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(item['TenLop'] ?? 'Lớp chưa tên', 
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 6),
                            Row(
                              children: [
                                const Icon(Icons.person, size: 18, color: Colors.black54),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    'Giáo viên: ${item['MaGiaoVien'] ?? 'Chưa phân công'}',
                                    style: const TextStyle(color: Colors.black87),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Row(
                              children: [
                                const Icon(Icons.schedule, size: 18, color: Colors.black54),
                                const SizedBox(width: 6),
                                Expanded(child: Text('Lịch học: ${_formatSchedule(schedules)}')),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.wb_twighlight, size: 18, color: Colors.black54),
                                const SizedBox(width: 6),
                                Expanded(child: Text('Buổi: $shiftText')),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.access_time, size: 18, color: Colors.black54),
                                const SizedBox(width: 6),
                                Expanded(child: Text('Giờ: ${_formatTime(schedules)}')),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              children: [
                                const Icon(Icons.calendar_month, size: 18, color: Colors.black54),
                                const SizedBox(width: 6),
                                Expanded(child: Text('Ngày bắt đầu: ${_formatStartDate(item)}')),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              'Còn $soChoConLai chỗ',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: soChoConLai > 0 ? Colors.green : Colors.red,
                              ),
                            ),
                            const SizedBox(height: 14),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: soChoConLai > 0 ? () async {
                                  final messenger = ScaffoldMessenger.of(context);
                                  final studentId = await UserSession.getUserId();
                                  final maLop = item['MaLop'] ?? 0;
                                  
                                  if (studentId == null) {
                                    messenger.showSnackBar(
                                      const SnackBar(content: Text('Lỗi: Không tìm thấy ID học viên')),
                                    );
                                    return;
                                  }
                                  
                                  try {
                                    final result = await EnrollmentService.registerClass(
                                      maHocVien: studentId,
                                      maLop: maLop as int,
                                    );
                                    
                                    if (!mounted) return;
                                    if (result['status'] == true) {
                                      messenger.showSnackBar(
                                        const SnackBar(content: Text('Đã đăng ký lớp thành công')),
                                      );
                                      await loadClasses();
                                    } else {
                                      messenger.showSnackBar(
                                        SnackBar(content: Text('Lỗi: ${result['message'] ?? 'Đăng ký thất bại'}')),
                                      );
                                    }
                                  } catch (e) {
                                    if (!mounted) return;
                                    messenger.showSnackBar(
                                      SnackBar(content: Text('Lỗi: $e')),
                                    );
                                  }
                                } : null,
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF5E35B1),
                                  foregroundColor: Colors.white,
                                  disabledBackgroundColor: Colors.grey.shade300,
                                  disabledForegroundColor: Colors.grey.shade700,
                                  padding: const EdgeInsets.symmetric(vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                  elevation: 2,
                                  textStyle: const TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                  ),
                                ),
                                child: Text(
                                  soChoConLai > 0 ? 'Đăng ký lớp này' : 'Hết chỗ',
                                ),
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
