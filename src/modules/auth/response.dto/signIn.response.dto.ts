import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    name: 'accessToken',
  })
  public accessToken: string;

  @ApiProperty({
    name: 'refreshToken',
  })
  public refreshToken: string;

  constructor(obj: SignUpResponseDto) {
    this.accessToken = obj.accessToken;
    this.refreshToken = obj.refreshToken;
  }
}
