import { ApiProperty } from '@nestjs/swagger';

export class GetMySpaceResponseDto {
  @ApiProperty({
    description: 'space id',
  })
  public id: number;

  @ApiProperty({
    description: 'space 이름',
  })
  public name: string;

  @ApiProperty({
    description: 'space 로고',
  })
  public logo: string;

  @ApiProperty({
    description: 'space code',
  })
  public code: string;

  @ApiProperty({
    description: 'space adminCode',
  })
  public adminCode: string;

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

  constructor(obj: GetMySpaceResponseDto) {
    this.id = obj.id;
    this.name = obj.name;
    this.logo = obj.logo;
    this.code = obj.code;
    this.adminCode = obj.adminCode;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}

export class GetMySpacesResponseDto {
  @ApiProperty({ type: [GetMySpaceResponseDto] })
  public spaces: GetMySpaceResponseDto[];

  constructor(obj: GetMySpaceResponseDto[]) {
    this.spaces = obj.map((item) => new GetMySpaceResponseDto(item));
  }
}
