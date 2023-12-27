import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { UsersModule } from '../users/users.module';
import { SpaceRolesModule } from '../space.roles/space.roles.module';
import { UserEntity } from '../../entities/user.entity';
import { PostsModule } from '../posts/posts.module';
import { PostEntity } from '../../entities/post.entity';
import { ChatsModule } from '../chat/chats.module';
import { ReplyChatsModule } from '../reply.chats/reply.chats.module';
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
    UsersModule,
    SpaceMembersModule,
    forwardRef(() => SpaceRolesModule),
    PostsModule,
    ChatsModule,
    ReplyChatsModule,
  ],
  exports: [SpacesService],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
