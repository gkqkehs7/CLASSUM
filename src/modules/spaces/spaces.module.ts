import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRolesModule } from '../space.roles/space.roles.module';
import { PostsModule } from '../posts/posts.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { ChatsModule } from '../chat/chats.module';
import { ReplyChatsModule } from '../reply.chats/reply.chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity]),
    SpaceMembersModule,
    forwardRef(() => ChatsModule),
    forwardRef(() => ReplyChatsModule),
    forwardRef(() => SpaceRolesModule),
    forwardRef(() => PostsModule),
  ],
  exports: [SpacesService],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
