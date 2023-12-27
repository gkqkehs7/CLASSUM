interface CreateSpaceRoleDAO {
  spaceId: number;
  roleName: string;
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
