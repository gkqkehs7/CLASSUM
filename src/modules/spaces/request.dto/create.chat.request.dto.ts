import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRequestDto {
  @ApiProperty({
    description: '댓글 내용',
  })
  @IsString()
  readonly content: string;

  @ApiProperty({
    description: '익명성 여부',
  })
  @IsBoolean()
  readonly anonymous: boolean;
}
