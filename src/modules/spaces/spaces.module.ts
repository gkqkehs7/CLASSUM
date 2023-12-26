import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpacesController } from './spaces.controller';
import { SpacesService } from './spaces.service';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { UsersModule } from '../users/users.module';
import { SpaceRolesModule } from '../spaceRole/spaceRoles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity, SpaceRoleEntity, SpaceMemberEntity]),
    UsersModule,
    SpaceRolesModule,
  ],
  controllers: [SpacesController],
  providers: [SpacesService],
})
export class SpacesModule {}
