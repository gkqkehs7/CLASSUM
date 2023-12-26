import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSpaceRoleResponseDto {
  @ApiProperty({
    name: '성공 여부',
  })
  public success: boolean;

  constructor(obj: UpdateUserSpaceRoleResponseDto) {
    this.success = obj.success;
  }
}
