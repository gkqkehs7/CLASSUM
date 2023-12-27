import { SpaceRoleType } from '../entities/spaceRole.entity';

interface CreateSpaceMemberDAO {
  userId: number;
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
}

export { CreateSpaceMemberDAO };
