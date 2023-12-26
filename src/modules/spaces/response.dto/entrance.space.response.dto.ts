import { ApiProperty } from '@nestjs/swagger';

export class EntranceSpaceResponseDto {
  @ApiProperty({
    name: '성공 여부',
  })
  public success: boolean;

  constructor(obj: EntranceSpaceResponseDto) {
    this.success = obj.success;
  }
}
