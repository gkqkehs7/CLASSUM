import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { SpaceMembersService } from './space.members.service';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity, SpaceMemberEntity, SpaceRoleEntity]),
  ],
  exports: [SpaceMembersService],
  providers: [SpaceMembersService],
})
export class SpaceMembersModule {}
