import { Module } from '@nestjs/common';
import { ReplyChatsService } from './reply.chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { ReplyChatEntity } from '../../entities/replyChat.entity';
import { PostsModule } from '../posts/posts.module';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { ChatsModule } from '../chat/chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      SpaceMemberEntity,
      PostEntity,
      ChatEntity,
      ReplyChatEntity,
    ]),
    PostsModule,
    ChatsModule,
    SpacesModule,
    SpaceMembersModule,
  ],
  exports: [ReplyChatsService],
  providers: [ReplyChatsService],
})
export class ReplyChatsModule {}
