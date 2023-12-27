import { ApiProperty } from '@nestjs/swagger';

export class GetMyInfoResponseDto {
  @ApiProperty({
    description: '유저 id',
  })
  public id: number;

  @ApiProperty({
    description: '유저 email',
  })
  public email: string;

  @ApiProperty({
    description: '유저 password',
  })
  public password: string;

  @ApiProperty({
    description: '유저 firstName',
  })
  public firstName: string;

  @ApiProperty({
    description: '유저 lastName',
  })
  public lastName: string;

  @ApiProperty({
    description: '유저 profileImageSrc',
  })
  public profileImageSrc: string;

  @ApiProperty({
    description: '유저 createdAt',
  })
  public createdAt: Date;

  @ApiProperty({
    description: '유저 updatedAt',
  })
  public updatedAt: Date;

  @ApiProperty({
    description: '유저 deletedAt',
  })
  public deletedAt: Date | null;

  constructor(obj: GetMyInfoResponseDto) {
    this.id = obj.id;
    this.email = obj.email;
    this.password = obj.password;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.profileImageSrc = obj.profileImageSrc;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}
