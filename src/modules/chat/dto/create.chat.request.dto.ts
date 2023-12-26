import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRequestDto {
  @ApiProperty({
    description: 'space 이름',
  })
  @IsString()
  readonly content: string;

  @ApiProperty({
    description: 'space 역할들',
  })
  @IsBoolean()
  readonly anonymous: boolean;
}
