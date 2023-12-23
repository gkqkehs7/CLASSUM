import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /**
   * accessToken 생성
   * @param userId
   */
  createAccessToken(userId: number): string {
    return this.jwtService.sign(
      { userId: `${userId}` },
      {
        expiresIn: `3600000`,
      },
    );
  }

  /**
   * refreshToken 생성
   * @param userId
   */
  createRefreshToken(userId: number): string {
    return this.jwtService.sign({ userId: `${userId}` }, { expiresIn: `30d` });
  }

  /**
   * refreshToken으로 accessToken 재생성
   * @param userId
   */
  refresh(userId: number): string {
    return this.createRefreshToken(userId);
  }
}
