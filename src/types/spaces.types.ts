import { SpaceRoleType } from '../entities/spaceRole.entity';
import { SpaceEntity } from '../entities/space.entity';

interface Space extends SpaceEntity {}

interface CreateSpaceMemberDAO {
  userId: number;
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
}

export { Space, CreateSpaceMemberDAO };
