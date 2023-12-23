import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInRequestDto {
  @ApiProperty({
    description: '유저 이메일',
  })
  @IsString()
  readonly email: string;

  @ApiProperty({
    description: '유저 비밀번호',
  })
  @IsString()
  readonly password: string;
}
