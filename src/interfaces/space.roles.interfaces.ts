import { SpaceRoleEntity, SpaceRoleType } from '../entities/spaceRole.entity';

interface SpaceRole extends SpaceRoleEntity {}

interface CreateSpaceRoleDAO {
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
}

export { SpaceRole, CreateSpaceRoleDAO };
