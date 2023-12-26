import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto } from './request.dto/signIn.request.dto';
import { SignInResponseDto } from './response.dto/signUp.response.dto';
import { SignUpRequestDto } from './request.dto/signUp.request.dto';
import { SignUpResponseDto } from './response.dto/signIn.response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
  })
  @Post('sign-in')
  async signIn(
    @Body() signInRequestDto: SignInRequestDto,
  ): Promise<SignInResponseDto> {
    const response = await this.authService.signIn(signInRequestDto);

    return new SignInResponseDto(response);
  }

  @ApiOperation({
    summary: '회원가입',
  })
  @Post('sign-up')
  async signUp(
    @Body() signUpRequestDto: SignUpRequestDto,
  ): Promise<SignUpResponseDto> {
    const response = await this.authService.signUp(signUpRequestDto);

    return new SignUpResponseDto(response);
  }
}
