import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EntranceSpaceRequestDto {
  @ApiProperty({
    description: 'space 입장 코드',
  })
  @IsString()
  readonly entranceCode: string;

  @ApiProperty({
    description: '입장 역할 이름',
  })
  @IsString()
  readonly roleName: string;
}
