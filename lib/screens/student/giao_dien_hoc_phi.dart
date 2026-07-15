import 'package:flutter/material.dart';
import '../../dich_vu/dich_vu_quan_tri.dart';
import '../../tien_ich/phien_lam_viec_nguoi_dung.dart';

class TuitionFeesScreen extends StatefulWidget {
  const TuitionFeesScreen({super.key});

  @override
  State<TuitionFeesScreen> createState() => _TuitionFeesScreenState();
}

class _TuitionFeesScreenState extends State<TuitionFeesScreen> {
  List<Map<String, dynamic>> _invoices = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadInvoices();
  }

  Future<void> _loadInvoices() async {
    setState(() => _isLoading = true);
    // Lấy dữ liệu từ Module 6: hocvien_lophoc
    final data = await AppDataService.loadRegistrations(); 
    setState(() {
      _invoices = data;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8F9FE),
      appBar: AppBar(
        title: const Text('HỌC PHÍ & THANH TOÁN', style: TextStyle(fontWeight: FontWeight.bold)),
        centerTitle: true,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _invoices.isEmpty
              ? _buildEmptyState()
              : ListView.builder(
                  padding: const EdgeInsets.all(20),
                  itemCount: _invoices.length,
                  itemBuilder: (context, index) => _buildInvoiceCard(_invoices[index]),
                ),
    );
  }

  Widget _buildInvoiceCard(Map<String, dynamic> item) {
    bool isPaid = item['dongHocPhi'] == true || item['DongHocPhi'] == 1;
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10)],
      ),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: Colors.blue.shade50, borderRadius: BorderRadius.circular(15)),
                  child: const Icon(Icons.receipt_long_rounded, color: Colors.blue),
                ),
                const SizedBox(width: 15),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(item['tenLopHoc'] ?? 'Lớp học', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('Ngày đăng ký: ${item['ngayDangKy']?.toString().substring(0, 10) ?? ''}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                    ],
                  ),
                ),
              ],
            ),
            const Divider(height: 30),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Tổng học phí', style: TextStyle(color: Colors.grey, fontSize: 11)),
                    Text('${item['hocPhi'] ?? 0}đ', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue)),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  decoration: BoxDecoration(
                    color: isPaid ? Colors.green.shade50 : Colors.red.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    isPaid ? 'ĐÃ ĐÓNG' : 'CHƯA ĐÓNG',
                    style: TextStyle(color: isPaid ? Colors.green : Colors.red, fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
            if (!isPaid) ...[
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF2563EB), minimumSize: const Size(double.infinity, 50)),
                child: const Text('THANH TOÁN TRỰC TUYẾN'),
              )
            ]
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return const Center(child: Text('Bạn chưa có hóa đơn học phí nào.'));
  }
}
