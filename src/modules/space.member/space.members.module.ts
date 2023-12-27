import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { SpaceMembersService } from './space.members.service';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceMemberEntity])],
  exports: [SpaceMembersService],
  providers: [SpaceMembersService],
})
export class SpaceMembersModule {}
