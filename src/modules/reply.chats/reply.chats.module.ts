import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyChatEntity } from '../../entities/replyChat.entity';
import { PostsModule } from '../posts/posts.module';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { ChatsModule } from '../chat/chats.module';
import { AlarmsModule } from '../alarms/alarms.module';
import { ReplyChatsService } from './reply.chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReplyChatEntity]),
    PostsModule,
    ChatsModule,
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
    AlarmsModule,
  ],
  exports: [ReplyChatsService],
  providers: [ReplyChatsService],
})
export class ReplyChatsModule {}
