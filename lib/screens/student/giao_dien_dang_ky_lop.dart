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

  Future<void> loadClasses() async {
    final token = await UserSession.getToken();
    final data = await ClassService.getClasses(token: token);
    final filtered = data.where((item) {
      final maKhoaHocValue = item['MaKhoaHoc'];
      if (widget.maKhoaHoc != null) {
        if (maKhoaHocValue != null && maKhoaHocValue.toString() == widget.maKhoaHoc.toString()) {
          return true;
        }
      }

      final courseName = widget.courseName?.toString().toLowerCase().trim();
      final className = item['TenLop']?.toString().toLowerCase() ?? '';
      if (courseName != null && courseName.isNotEmpty) {
        return className.contains(courseName);
      }

      return widget.maKhoaHoc == null;
    }).toList();

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
      appBar: AppBar(title: Text(widget.courseName != null && widget.courseName!.isNotEmpty
          ? 'Lớp của ${widget.courseName}'
          : 'Đăng ký lớp học')),
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
                      margin: const EdgeInsets.only(bottom: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.blue.shade50,
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: Text(shiftText, style: const TextStyle(fontWeight: FontWeight.bold)),
                                ),
                                const SizedBox(width: 8),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(item['TenLop'] ?? 'Lớp chưa tên', 
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 6),
                            Text('Giáo viên: ${item['MaGiaoVien'] ?? 'Chưa phân công'}'),
                            const SizedBox(height: 10),
                            Text('Lịch học: ${_formatSchedule(schedules)}'),
                            Text('Buổi: $shiftText'),
                            Text('Giờ: ${_formatTime(schedules)}'),
                            Text('Ngày bắt đầu: ${_formatStartDate(item)}'),
                            const SizedBox(height: 6),
                            Text(
                              'Còn $soChoConLai chỗ',
                              style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: soChoConLai > 0 ? Colors.green : Colors.red,
                              ),
                            ),
                            const SizedBox(height: 10),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: soChoConLai > 0 ? () async {
                                  final studentId = await UserSession.getUserId();
                                  final maLop = item['MaLop'] ?? 0;
                                  
                                  if (studentId == null) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(content: Text('Lỗi: Không tìm thấy ID học viên')),
                                    );
                                    return;
                                  }
                                  
                                  try {
                                    final result = await EnrollmentService.registerClass(
                                      maHocVien: studentId,
                                      maLop: maLop as int,
                                    );
                                    
                                    if (mounted) {
                                      if (result['status'] == true) {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          const SnackBar(content: Text('Đã đăng ký lớp thành công')),
                                        );
                                        // Load lại danh sách lớp để cập nhật số chỗ
                                        await loadClasses();
                                      } else {
                                        ScaffoldMessenger.of(context).showSnackBar(
                                          SnackBar(content: Text('Lỗi: ${result['message'] ?? 'Đăng ký thất bại'}')),
                                        );
                                      }
                                    }
                                  } catch (e) {
                                    if (mounted) {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Lỗi: $e')),
                                      );
                                    }
                                  }
                                } : null,
                                child: Text(soChoConLai > 0 ? 'Đăng ký lớp này' : 'Hết chỗ'),
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
