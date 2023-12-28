import { ApiProperty } from '@nestjs/swagger';

class GetMyAlarmResponseDto {
  @ApiProperty({
    description: 'alarm id',
  })
  public id: number;

  @ApiProperty({
    description: 'alarm 내용',
  })
  public content: string;

  @ApiProperty({
    description: 'alarm 여부',
  })
  public priority: number;

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

  constructor(obj: GetMyAlarmResponseDto) {
    this.id = obj.id;
    this.content = obj.content;
    this.priority = obj.priority;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}

export class GetMyAlarmsResponseDto {
  @ApiProperty({ type: [GetMyAlarmResponseDto] })
  public alarms: GetMyAlarmResponseDto[];

  constructor(obj: GetMyAlarmResponseDto[]) {
    this.alarms = obj.map((item) => new GetMyAlarmResponseDto(item));
  }
}
