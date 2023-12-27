import { SpaceRoleType } from '../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../entities/spaceMember.entity';

interface SpaceMember extends SpaceMemberEntity {}

interface CreateSpaceMemberDAO {
  userId: number;
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
}

export { SpaceMember, CreateSpaceMemberDAO };
