// src/modules/auth/dto/verify-email.dto.ts

export interface VerifyEmailDto {
  email: string;
  otp: string;
}

export interface ResendOtpDto {
  email: string;
}

export interface VerifyEmailResponse {
  message: string;
}