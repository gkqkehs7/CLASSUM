import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRolesModule } from '../space.roles/space.roles.module';
import { PostsModule } from '../posts/posts.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { ChatsModule } from '../chat/chats.module';
import { ReplyChatsModule } from '../reply.chats/reply.chats.module';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';

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
