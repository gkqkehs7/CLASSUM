type CreateSpaceRoleDAO = {
  spaceId: number;
  roleName: string;
};

type DeleteSpaceRoleResponse = {
  success: true;
};

type UpdateUserSpaceRoleResponse = {
  success: true;
};

export type {
  CreateSpaceRoleDAO,
  DeleteSpaceRoleResponse,
  UpdateUserSpaceRoleResponse,
};
