import { ApiProperty } from '@nestjs/swagger';

export class GetMySpaceResponseDto {
  @ApiProperty({
    name: 'space id',
  })
  public id: number;

  @ApiProperty({
    name: 'space 이름',
  })
  public name: string;

  @ApiProperty({
    name: 'space 로고',
  })
  public logo: string;

  constructor(obj: GetMySpaceResponseDto) {
    this.id = obj.id;
    this.name = obj.name;
    this.logo = obj.logo;
  }
}

export class GetMySpacesResponseDto {
  @ApiProperty({ type: [GetMySpaceResponseDto] })
  public spaces: GetMySpaceResponseDto[];

  constructor(obj: GetMySpaceResponseDto[]) {
    this.spaces = obj.map((space) => new GetMySpaceResponseDto(space));
  }
}
