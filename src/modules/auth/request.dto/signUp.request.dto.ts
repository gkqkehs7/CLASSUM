import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpRequestDto {
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

  @ApiProperty({
    description: '유저 이름',
  })
  @IsString()
  readonly firstName: string;

  @ApiProperty({
    description: '유저 성',
  })
  @IsString()
  readonly lastName: string;

  @ApiProperty({
    description: '유저 이미지 저장소 주소',
  })
  @IsString()
  readonly profileImageSrc: string;
}
