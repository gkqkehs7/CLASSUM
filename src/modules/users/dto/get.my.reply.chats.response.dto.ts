import { ApiProperty } from '@nestjs/swagger';

class GetMyReplyChatResponseDto {
  @ApiProperty({
    description: 'chat id',
  })
  public id: number;

  @ApiProperty({
    description: 'chat 내용',
  })
  public content: string;

  @ApiProperty({
    description: 'chat 익명성 여부',
  })
  public anonymous: boolean;

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

  constructor(obj: GetMyReplyChatResponseDto) {
    this.id = obj.id;
    this.content = obj.content;
    this.anonymous = obj.anonymous;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}

export class GetMyReplyChatsResponseDto {
  @ApiProperty({ type: [GetMyReplyChatResponseDto] })
  public replyChats: GetMyReplyChatResponseDto[];

  constructor(obj: GetMyReplyChatResponseDto[]) {
    this.replyChats = obj.map((item) => new GetMyReplyChatResponseDto(item));
  }
}
