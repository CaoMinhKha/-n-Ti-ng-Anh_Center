// src/modules/auth/utils/bcrypt.util.ts

import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash mật khẩu
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * So sánh mật khẩu với hash
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}