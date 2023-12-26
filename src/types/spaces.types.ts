import { SpaceRoleType } from '../entities/spaceRole.entity';

type Space = {
  id: number;
  name: string;
  logo: string;
  code: string;
  adminCode: string;
};

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
  Space,
  CreateSpaceReponse,
  DeleteSpaceResponse,
  CreateSpaceMemberDAO,
  EntranceSpaceResponse,
};
