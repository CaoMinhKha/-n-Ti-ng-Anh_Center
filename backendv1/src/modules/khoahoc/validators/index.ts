// src/modules/khoahoc/validators/index.ts

// =============================================
// EXPORT TẤT CẢ VALIDATORS
// =============================================

// Khóa học
export {
  createKhoaHocSchema,
  updateKhoaHocSchema,
  khoaHocQuerySchema,
  validate as validateKhoaHoc,
} from './khoahoc.validator.js';

// Bài học
export {
  createBaiHocSchema,
  updateBaiHocSchema,
  baiHocQuerySchema,
} from './baihoc.validator.js';

// Phần bài học
export {
  createPhanBaiHocSchema,
  updatePhanBaiHocSchema,
} from './phanbaihoc.validator.js';

// Bài kiểm tra
export {
  createBaiKiemTraSchema,
  updateBaiKiemTraSchema,
} from './baikiemtra.validator.js';

// Cập nhật thứ tự
export {
  updateBaiHocOrderSchema,
  updatePhanBaiHocOrderSchema,
} from './update-order.validator.js';

// =============================================
// RE-EXPORT validate từ zod-helper
// =============================================
// Lưu ý: validate được export từ mỗi file validator,
// nhưng để tránh conflict, ta dùng tên khác hoặc chỉ export 1 lần

// Cách 1: Export validate từ file chính (khuyến dùng)
export { validate } from './khoahoc.validator.js';

// Hoặc Cách 2: Tạo file validator riêng
// export { validate } from '../../../utils/zod-helper.js';