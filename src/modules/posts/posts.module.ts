import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      SpaceRoleEntity,
      SpaceMemberEntity,
      PostEntity,
    ]),
  ],
  providers: [PostsService],
})
export class PostsModule {}
