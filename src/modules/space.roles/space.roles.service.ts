import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { DeleteSpaceRoleRequestDto } from '../spaces/request.dto/delete.space.role.request.dto';
import { UpdateUserSpaceRoleRequestDto } from '../spaces/request.dto/update.user.space.role.request.dto';
import { SpaceMembersService } from '../space.member/space.members.service';
import { SpacesService } from '../spaces/spaces.service';
import { SuccessResponse } from '../../interfaces/common.interfaces';
import {
  CreateSpaceRoleDAO,
  SpaceRole,
} from '../../interfaces/space.roles.interfaces';

@Injectable()
export class SpaceRolesService {
  constructor(
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRolesRepository: Repository<SpaceRoleEntity>,
    @Inject(forwardRef(() => SpacesService))
    private readonly spacesService: SpacesService,
    private readonly spaceMembersService: SpaceMembersService,
  ) {}

  /**
   * spaceRoleEntity 생성
   * @param createSpaceRoleDAO
   * @param queryRunner
   */
  async createSpaceRoleEntity(
    createSpaceRoleDAO: CreateSpaceRoleDAO,
    queryRunner: QueryRunner,
  ): Promise<SpaceRole> {
    const { spaceId, roleName, roleType } = createSpaceRoleDAO;

    const spaceRole = new SpaceRoleEntity();
    spaceRole.spaceId = spaceId;
    spaceRole.roleName = roleName;
    spaceRole.roleType = roleType;

    if (queryRunner) {
      await queryRunner.manager.getRepository(SpaceRoleEntity).save(spaceRole);
    } else {
      await this.spaceRolesRepository.save(spaceRole);
    }

    return spaceRole;
  }

  /**
   * spaceRoleEntity 가져오기
   * @param where
   * @param relations
   */
  async getSpaceRoleEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<SpaceRole> {
    const spaceRole = await this.spaceRolesRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!spaceRole) {
      throw new Error('존재하지 않는 spaceRole 입니다.');
    }

    return spaceRole;
  }

  /**
   * spaceRoleEntity 삭제
   * @param spaceRole
   * @param queryRunner
   */
  async deleteSpaceRoleEntity(
    spaceRole: SpaceRoleEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager
        .getRepository(SpaceRoleEntity)
        .softRemove(spaceRole);
    } else {
      await this.spaceRolesRepository.softRemove(spaceRole);
    }
  }

  /**
   * spaceRole 삭제
   * @param userId
   * @param spaceId
   * @param deleteSpaceRoleRequestDto
   */
  async deleteSpaceRole(
    userId: number,
    spaceId: number,
    deleteSpaceRoleRequestDto: DeleteSpaceRoleRequestDto,
  ): Promise<SuccessResponse> {
    const { roleName } = deleteSpaceRoleRequestDto;

    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, ['spaceRoles']);

    // 관리자인지 확인
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (!isAdmin) {
      throw new Error('관리자만 spaceRole을 삭제할 수 있습니다.');
    }

    // 존재하는 spaceRole인지 확인
    const spaceRole = await this.getSpaceRoleEntity(
      {
        spaceId: spaceId,
        roleName: roleName,
      },
      null,
    );

    // 유저가 spaceRole를 사용하고 있는지 확인
    const isUsed = await this.spaceMemberRepository.findOne({
      where: { spaceId: spaceId, roleName: roleName },
    });

    if (isUsed) {
      throw new Error('해당 spaceRole을 사용하는 유저가 존재합니다.');
    }

    // 사용하는 유저가 없을때만 spaceRole 삭제
    await this.deleteSpaceRoleEntity(spaceRole, null);

    return { success: true };
  }

  /**
   * 유저의 spaceRole 변경
   * @param userId
   * @param chageUserId
   * @param spaceId
   * @param updateUserSpaceRoleRequestDto
   */
  async updateUserSpaceRole(
    userId: number,
    memberId: number,
    spaceId: number,
    updateUserSpaceRoleRequestDto: UpdateUserSpaceRoleRequestDto,
  ): Promise<SuccessResponse> {
    const { roleName, roleType } = updateUserSpaceRoleRequestDto;

    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 관리자인지 확인
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (!isAdmin) {
      throw new Error('관리자만 spaceRole을 변경할 수 있습니다.');
    }

    // 역할을 바꾸려는 유저가 space의 member인지 확인
    const spaceMember = await this.spaceMembersService.getSpaceMemberEntity(
      memberId,
      spaceId,
    );

    // 해당 역할이 존재하는지 확인
    await this.getSpaceRoleEntity(
      { roleName: roleName, roleType: roleType },
      null,
    );

    // 유저의 역할 변경
    await this.spaceMembersService.updateSpaceMemberEntity(
      spaceMember,
      {
        roleName: roleName,
        roleType: roleType,
      },
      null,
    );

    return { success: true };
  }
}
