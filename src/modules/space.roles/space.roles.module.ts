import { forwardRef, Module } from '@nestjs/common';
import { SpaceRolesService } from './space.roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMembersModule } from '../space.member/space.members.module';
import { SpacesModule } from '../spaces/spaces.module';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceMemberEntity, SpaceRoleEntity]),
    forwardRef(() => SpacesModule),
    SpaceMembersModule,
  ],
  exports: [SpaceRolesService],
  providers: [SpaceRolesService],
})
export class SpaceRolesModule {}
