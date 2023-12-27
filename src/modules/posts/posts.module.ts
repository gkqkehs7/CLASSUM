import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      SpaceRoleEntity,
      SpaceMemberEntity,
      PostEntity,
    ]),
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
  ],
  exports: [PostsService],
  providers: [PostsService],
})
export class PostsModule {}
