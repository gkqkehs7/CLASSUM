import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../../../entities/post.entity';
import { IsString } from 'class-validator';

class User {
  @ApiProperty({
    description: '유저 id',
  })
  public id: number;

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

  constructor(obj: User) {
    this.id = obj.id;
    this.firstName = obj.firstName;
    this.lastName = obj.lastName;
    this.profileImageSrc = obj.profileImageSrc;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}

class Chat {
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

  @ApiProperty({
    description: '댓글 단 유저 정보',
  })
  public user: User | null;

  @ApiProperty({
    description: '답글들',
  })
  public replyChats: ReplyChat[];

  constructor(obj: Chat) {
    this.id = obj.id;
    this.content = obj.content;
    this.anonymous = obj.anonymous;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
    this.user = obj.user === null ? null : new User(obj.user);
    this.replyChats = obj.replyChats.map(
      (replyChat) => new ReplyChat(replyChat),
    );
  }
}

class ReplyChat {
  @ApiProperty({
    description: 'replyChat id',
  })
  public id: number;

  @ApiProperty({
    description: 'replyChat 내용',
  })
  public content: string;

  @ApiProperty({
    description: 'replyChat 익명성 여부',
  })
  public anonymous: boolean;

  @ApiProperty({
    description: 'replyChat createdAt',
  })
  public createdAt: Date;

  @ApiProperty({
    description: 'replyChat updatedAt',
  })
  public updatedAt: Date;

  @ApiProperty({
    description: 'replyChat deletedAt',
  })
  public deletedAt: Date | null;

  @ApiProperty({
    description: '답글 단 유저 정보',
  })
  public user: User | null;

  constructor(obj: ReplyChat) {
    this.id = obj.id;
    this.content = obj.content;
    this.anonymous = obj.anonymous;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
    this.user = obj.user === null ? null : new User(obj.user);
  }
}

export class GetPostResponseDto {
  @ApiProperty({
    description: 'post id',
  })
  public id: number;

  @ApiProperty({
    description: 'post 제목',
  })
  public title: string;

  @ApiProperty({
    description: 'post 내용',
  })
  public content: string;

  @ApiProperty({
    description: 'post file 저장소 src',
  })
  @IsString()
  readonly fileSrc: string;

  @ApiProperty({
    description: 'post type',
  })
  public type: PostType;

  @ApiProperty({
    description: 'post 익명성 여',
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

  @ApiProperty({
    description: '글을 작성한 유저',
  })
  public user: User | null;

  @ApiProperty({
    description: '댓글들',
  })
  public chats: Chat[];

  constructor(obj: GetPostResponseDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.content = obj.content;
    this.fileSrc = obj.fileSrc;
    this.type = obj.type;
    this.anonymous = obj.anonymous;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
    this.user = obj.user === null ? null : new User(obj.user);
    this.chats = obj.chats.map((chat) => new Chat(chat));
  }
}
