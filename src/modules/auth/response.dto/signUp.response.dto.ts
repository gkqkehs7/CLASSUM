import { ApiProperty } from '@nestjs/swagger';

export class SignInResponseDto {
  @ApiProperty({
    name: 'accessToken',
  })
  public accessToken: string;

  @ApiProperty({
    name: 'refreshToken',
  })
  public refreshToken: string;

  constructor(obj: SignInResponseDto) {
    this.accessToken = obj.accessToken;
    this.refreshToken = obj.refreshToken;
  }
}
