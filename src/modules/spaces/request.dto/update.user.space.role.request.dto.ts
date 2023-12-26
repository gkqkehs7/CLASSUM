import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SpaceRoleType } from '../../../entities/spaceRole.entity';

export class UpdateUserSpaceRoleRequestDto {
  @ApiProperty({
    description: '바꿀 spaceRole Type',
  })
  @IsString()
  readonly roleType: SpaceRoleType;

  @ApiProperty({
    description: '바꿀 spaceRole 이름',
  })
  @IsString()
  readonly roleName: string;
}
