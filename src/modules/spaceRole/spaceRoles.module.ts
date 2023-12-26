import { Module } from '@nestjs/common';
import { SpaceRolesService } from './spaceRoles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceEntity } from '../../entities/space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceEntity, SpaceRoleEntity])],
  exports: [SpaceRolesService],
  providers: [SpaceRolesService],
})
export class SpaceRolesModule {}
