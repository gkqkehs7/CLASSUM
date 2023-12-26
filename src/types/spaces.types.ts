import { SpaceRoleType } from '../entities/spaceRole.entity';

type CreateSpaceReponse = {
  success: boolean;
};

type DeleteSpaceResponse = {
  success: boolean;
};

type CreateSpaceMemberDAO = {
  userId: number;
  spaceId: number;
  roleName: string;
  roleType: SpaceRoleType;
};

type EntranceSpaceResponse = {
  success: boolean;
};

export type {
  CreateSpaceReponse,
  DeleteSpaceResponse,
  CreateSpaceMemberDAO,
  EntranceSpaceResponse,
};
