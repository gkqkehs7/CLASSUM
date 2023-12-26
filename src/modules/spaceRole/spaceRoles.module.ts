import { Module } from '@nestjs/common';
import { SpaceRolesService } from './spaceRoles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceRoleEntity])],
  providers: [SpaceRolesService],
})
export class SpaceRolesModule {}
