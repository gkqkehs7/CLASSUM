import { Module } from '@nestjs/common';
import { ReplyChatsService } from './reply.chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { ReplyChatEntity } from '../../entities/replyChat.entity';

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
  ],
  exports: [ReplyChatsService],
  providers: [ReplyChatsService],
})
export class ReplyChatsModule {}
