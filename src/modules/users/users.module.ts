import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../entities/user.entity';
import { UsersService } from './users.service';
import { SpacesModule } from '../spaces/spaces.module';
import { PostsModule } from '../posts/posts.module';
import { ChatsModule } from '../chat/chats.module';
import { ReplyChatsModule } from '../reply.chats/reply.chats.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    SpacesModule,
    PostsModule,
    ChatsModule,
    ReplyChatsModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
