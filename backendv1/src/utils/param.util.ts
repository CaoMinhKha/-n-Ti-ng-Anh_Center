// src/utils/param.util.ts
import { ParsedQs } from 'qs';
import { AppError } from '../middleware/error.middleware.js';

/**
 * Lấy ID từ request params
 */
export function getParamId(param: string | string[]): number {
  const idString = Array.isArray(param) ? param[0] : param;
  const id = parseInt(idString);
  
  if (isNaN(id)) {
    throw new AppError('ID không hợp lệ', 400);
  }
  
  return id;
}

/**
 * Lấy string từ request params
 */
export function getParamString(
  value: string | ParsedQs | (string | ParsedQs)[] | undefined
): string | undefined {
  if (!value) return undefined;
  
  // Nếu là mảng, lấy phần tử đầu tiên
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }
  
  // Nếu là string, trả về
  if (typeof value === 'string') {
    return value;
  }
  
  // Nếu là ParsedQs (object), không dùng được
  return undefined;
}

