import { forwardRef, Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { PostsModule } from '../posts/posts.module';
import { AlarmsModule } from '../alarms/alarms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SpaceEntity,
      SpaceMemberEntity,
      PostEntity,
      ChatEntity,
    ]),
    PostsModule,
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
    AlarmsModule,
  ],
  exports: [ChatsService],
  providers: [ChatsService],
})
export class ChatsModule {}
