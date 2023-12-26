import { ApiProperty } from '@nestjs/swagger';

export class DeleteSpaceResponseDto {
  @ApiProperty({
    name: '성공 여부',
  })
  public success: boolean;

  constructor(obj: DeleteSpaceResponseDto) {
    this.success = obj.success;
  }
}
