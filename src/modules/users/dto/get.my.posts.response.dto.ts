import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '../../../entities/post.entity';

class GetMyPostResponseDto {
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

  constructor(obj: GetMyPostResponseDto) {
    this.id = obj.id;
    this.title = obj.title;
    this.content = obj.content;
    this.type = obj.type;
    this.anonymous = obj.anonymous;
    this.createdAt = obj.createdAt;
    this.updatedAt = obj.updatedAt;
    this.deletedAt = obj.deletedAt;
  }
}

export class GetMyPostsResponseDto {
  @ApiProperty({ type: [GetMyPostResponseDto] })
  public posts: GetMyPostResponseDto[];

  constructor(obj: GetMyPostResponseDto[]) {
    this.posts = obj.map((item) => new GetMyPostResponseDto(item));
  }
}
