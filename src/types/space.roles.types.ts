import { SpaceRoleType } from '../entities/spaceRole.entity';

interface CreateSpaceRoleDAO {
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
}

interface DeleteSpaceRoleResponse {
  success: true;
}

interface UpdateUserSpaceRoleResponse {
  success: true;
}

export {
  CreateSpaceRoleDAO,
  DeleteSpaceRoleResponse,
  UpdateUserSpaceRoleResponse,
};
