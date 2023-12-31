import { IsArray, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceRequestDto {
  @ApiProperty({
    description: 'space 이름',
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description: 'space 로고',
  })
  @IsString()
  readonly logo: string;

  @ApiProperty({
    description: '참여자용 입장 코드',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  readonly code: string;

  @ApiProperty({
    description: '관리자용 입장 코드',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(8)
  readonly adminCode: string;

  @ApiProperty({
    description: '자신 역할 이름',
  })
  @IsString()
  readonly roleName: string;

  @ApiProperty({
    description: '관리자 역할 이름들',
  })
  @IsArray()
  @IsString({ each: true })
  readonly adminRoleNames: string[];

  @ApiProperty({
    description: '참여자 역할 이름들',
  })
  @IsArray()
  @IsString({ each: true })
  readonly partRoleNames: string[];
}
