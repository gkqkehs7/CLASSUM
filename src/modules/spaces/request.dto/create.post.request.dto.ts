import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostRequestDto {
  @ApiProperty({
    description: 'post 제목',
  })
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'post 내용',
  })
  @IsString()
  readonly content: string;

  @ApiProperty({
    description: 'post file 저장소 src',
  })
  @IsString()
  readonly fileSrc: string;

  @ApiProperty({
    description: '익명성 여부',
  })
  @IsBoolean()
  readonly anonymous: boolean;
}
