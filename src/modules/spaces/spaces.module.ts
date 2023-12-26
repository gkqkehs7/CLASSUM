import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { UsersModule } from '../users/users.module';
import { SpaceRolesModule } from '../spaceRole/spaceRoles.module';
import { UserEntity } from '../../entities/user.entity';
import { PostsModule } from '../posts/posts.module';
import { PostEntity } from '../../entities/post.entity';
import { ChatsModule } from '../chat/chats.module';

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
    SpaceRolesModule,
    PostsModule,
    ChatsModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
