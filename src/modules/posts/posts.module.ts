import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostEntity } from '../../entities/post.entity';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { AlarmsModule } from '../alarms/alarms.module';
import { PostsService } from './posts.service';

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
