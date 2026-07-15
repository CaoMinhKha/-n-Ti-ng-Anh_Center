// src/modules/reports/dto/report-query.dto.ts

export interface RevenueQueryDto {
  period: 'month' | 'quarter' | 'year';
  year: number;
  month?: number;
  quarter?: number;
}

export interface StudentReportQueryDto {
  trinhDo?: string;
  status?: 'HOAT_DONG' | 'KHOA' | 'CHO_XAC_THUC' | 'ALL';
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ClassReportQueryDto {
  status?: 'SAP_KHAI_GIANG' | 'DANG_HOC' | 'DA_KET_THUC' | 'DA_HUY' | 'ALL';
  khoaHoc?: number;
  giaoVien?: number;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface DashboardResponse {
  total_students: number;
  total_teachers: number;
  total_courses: number;
  total_classes: number;
  active_classes: number;
  upcoming_classes: number;
  total_revenue: number;
  new_students_this_month: number;
  student_growth: number;
  monthly_students: { month: string; count: number }[];
  monthly_revenue: { month: string; revenue: number }[];
  level_distribution: { level: string; count: number }[];
  class_status_distribution: { status: string; count: number }[];
}

export interface RevenueResponse {
  period: string;
  total_revenue: number;
  student_count: number;
  class_count: number;
  detail: { week: number; revenue: number; students: number }[];
}