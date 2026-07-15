// src/modules/auth/dto/refresh-token.dto.ts

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}