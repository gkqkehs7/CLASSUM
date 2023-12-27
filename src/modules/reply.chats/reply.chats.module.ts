import { forwardRef, Module } from '@nestjs/common';
import { ReplyChatsService } from './reply.chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyChatEntity } from '../../entities/replyChat.entity';
import { PostsModule } from '../posts/posts.module';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { ChatsModule } from '../chat/chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplyChatEntity]),
    PostsModule,
    ChatsModule,
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
  ],
  exports: [ReplyChatsService],
  providers: [ReplyChatsService],
})
export class ReplyChatsModule {}
