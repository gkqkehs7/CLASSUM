import { ApiProperty } from '@nestjs/swagger';

export class CreateSpaceResponseDto {
  @ApiProperty({
    name: '성공 여부',
  })
  public success: boolean;

  constructor(obj: CreateSpaceResponseDto) {
    this.success = obj.success;
  }
}
