import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostEntity } from '../../entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { AlarmsModule } from '../alarms/alarms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity]),
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
    AlarmsModule,
  ],
  exports: [PostsService],
  providers: [PostsService],
})
export class PostsModule {}
