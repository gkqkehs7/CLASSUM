import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeleteSpaceRoleRequestDto {
  @ApiProperty({
    description: '삭제하려는 spaceRole 이름',
  })
  @IsString()
  readonly roleName: string;
}
