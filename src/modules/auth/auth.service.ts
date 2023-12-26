import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { SignInRequestDto } from './request.dto/signIn.request.dto';
import { SignUpRequestDto } from './request.dto/signUp.request.dto';
import { SignInResponse, SignUpResponse } from '../../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * 로그인
   * @param signInRequestDto
   */
  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponse> {
    const { email, password } = signInRequestDto;

    // 이메일로 유저 검색
    const user = await this.usersService.findUserByEmail(email);

    // 유저 비밀번호 확인
    const passwordMatch = await this.checkPassword(password, user.password);

    if (!passwordMatch) {
      throw new Error('비밀번호가 잘못되었습니다.');
    }

    // 유저 id로 토큰들 생성
    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  /**
   * 회원가입
   * @param signUpRequestDto
   */
  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponse> {
    const { email, password, firstName, lastName, profileImageSrc } =
      signUpRequestDto;

    // 해당 이메일로 가입한 유저가 존재하는지 확인
    const isExist = await this.usersService.userExistsByEmail(email);

    if (isExist) {
      throw new Error('이미 가입된 유저입니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await this.hashPassword(password);

    // 유저 생성
    const user = await this.usersService.createUser({
      email: email,
      hashedPassword: hashedPassword,
      firstName: firstName,
      lastName: lastName,
      profileImageSrc: profileImageSrc,
    });

    // 유저 id로 토큰들 생성
    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  /**
   * 비밀번호 암호화
   * @param password
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  /**
   * 비밀번호 비교
   * @param password
   * @param hashedPassword
   */
  async checkPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

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
   * accessToken 재생성
   * @param userId
   */
  refresh(userId: number): string {
    return this.createRefreshToken(userId);
  }
}
