import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty({
    name: '성공 여부',
  })
  public success: boolean;

  constructor(obj: SuccessResponseDto) {
    this.success = obj.success;
  }
}
