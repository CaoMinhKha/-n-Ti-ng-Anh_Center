// src/modules/reports/dto/student-report.dto.ts

export interface StudentDashboardResponse {
  total_lessons: number;
  completed_lessons: number;
  progress_percent: number;
  avg_score: number;
  current_rank: string;
  total_buoi: number;
  co_mat: number;
  attendance_percent: number;
  classes: {
    id: number;
    ten_lop_hoc: string;
    khoa_hoc: string;
    giao_vien: string;
    progress: number;
    avg_score: number;
    trang_thai: string;
  }[];
  notifications: {
    type: 'upcoming_class' | 'upcoming_exam' | 'new_result';
    message: string;
    date: Date;
  }[];
}

export interface StudentResultResponse {
  class_info: {
    id: number;
    ten_lop_hoc: string;
    khoa_hoc: string;
    giao_vien: string;
    ngay_bat_dau: Date;
    ngay_ket_thuc: Date;
  };
  scores: {
    diem_chuyen_can: number;
    diem_bai_tap: number;
    diem_kiem_tra: number;
    tong_diem: number;
    xep_loai: string;
  };
  progress: {
    phan_bai_hoc_id: number;
    ten_phan_bai_hoc: string;
    tong_so_cau_hoi: number;
    tong_so_cau_hoi_dung: number;
    ti_le_hoan_thanh: number;
    trang_thai: string;
  }[];
  class_avg_score?: number;
  class_rank?: number;
}

export interface StudentAttendanceResponse {
  total_buoi: number;
  co_mat: number;
  vang_co_phep: number;
  vang_khong_phep: number;
  di_muon: number;
  attendance_percent: number;
  history: {
    date: string;
    trang_thai: string;
    ghi_chu: string | null;
    lop_hoc: string;
    ca_hoc: string;
  }[];
}