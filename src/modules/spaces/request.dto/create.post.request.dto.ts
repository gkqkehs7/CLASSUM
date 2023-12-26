import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../../../entities/post.entity';

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
    description: '익명성 여부',
  })
  @IsString()
  readonly anonymous: boolean;
}
