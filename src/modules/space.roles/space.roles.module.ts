import { forwardRef, Module } from '@nestjs/common';
import { SpaceRolesService } from './space.roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { SpacesModule } from '../spaces/spaces.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity, SpaceMemberEntity, SpaceRoleEntity]),
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
  ],
  exports: [SpaceRolesService],
  providers: [SpaceRolesService],
})
export class SpaceRolesModule {}
