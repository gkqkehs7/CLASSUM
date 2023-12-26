import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      SpaceMemberEntity,
      PostEntity,
      ChatEntity,
    ]),
  ],
  exports: [ChatsService],
  providers: [ChatsService],
})
export class ChatsModule {}
