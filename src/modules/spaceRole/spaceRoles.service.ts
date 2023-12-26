import { Injectable } from '@nestjs/common';
import {
  CreateSpaceRoleDAO,
  DeleteSpaceRoleResponse,
  UpdateUserSpaceRoleResponse,
} from '../../types/space.roles.types';
import { QueryRunner, Repository } from 'typeorm';
import {
  SpaceRoleEntity,
  SpaceRoleType,
} from '../../entities/spaceRole.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { DeleteSpaceRoleRequestDto } from '../spaces/request.dto/delete.space.role.request.dto';
import { UpdateUserSpaceRoleRequestDto } from '../spaces/request.dto/update.user.space.role.request.dto';

@Injectable()
export class SpaceRolesService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRoleRepository: Repository<SpaceRoleEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
  ) {}

  /**
   * space 역할 생성
   * @param createSpaceRoleDAO
   * @param queryRunner
   */
  async createSpaceRole(
    createSpaceRoleDAO: CreateSpaceRoleDAO,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const { spaceId, roleName } = createSpaceRoleDAO;

    const spaceRole = new SpaceRoleEntity();
    spaceRole.roleType = SpaceRoleType.PARTICIPANT;
    spaceRole.roleName = roleName;
    spaceRole.spaceId = spaceId;

    await queryRunner.manager.getRepository(SpaceRoleEntity).save(spaceRole);
  }

  /**
   * space role 삭제
   * @param userId
   * @param spaceId
   * @param deleteSpaceRoleRequestDto
   */
  async deleteSpaceRole(
    userId: number,
    spaceId: number,
    deleteSpaceRoleRequestDto: DeleteSpaceRoleRequestDto,
  ): Promise<DeleteSpaceRoleResponse> {
    const { roleName } = deleteSpaceRoleRequestDto;

    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
      relations: ['spaceRoles'],
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    if (spaceMember.roleType !== SpaceRoleType.ADMIN) {
      throw new Error('관리자만 spaceRole을 삭제할 수 있습니다.');
    }

    const roleNames = space.spaceRoles.map((spaceRole) => spaceRole.roleName);

    if (!roleNames.includes(roleName)) {
      throw new Error('존재하지 않는 spaceRole 입니다.');
    }

    const isUsed = await this.spaceMemberRepository.findOne({
      where: { spaceId: spaceId, roleName: roleName },
    });

    if (!isUsed) {
      throw new Error('해당 spaceRole을 사용하는 유저가 존재합니다.');
    }

    await this.spaceRoleRepository.softDelete({
      spaceId: spaceId,
      roleName: roleName,
    });

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
    chageUserId: number,
    spaceId: number,
    updateUserSpaceRoleRequestDto: UpdateUserSpaceRoleRequestDto,
  ): Promise<UpdateUserSpaceRoleResponse> {
    const { roleName, roleType } = updateUserSpaceRoleRequestDto;

    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
      relations: ['spaceRoles'],
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    if (spaceMember.roleType !== SpaceRoleType.ADMIN) {
      throw new Error('관리자만 spaceRole을 변경 수 있습니다.');
    }

    // 참여자로 바꾸려는 경우 해당 역할이 존재하는지 확인
    if (roleType === 'participant') {
      const roleNames = space.spaceRoles.map((spaceRole) => spaceRole.roleName);

      if (!roleNames.includes(roleName)) {
        throw new Error('존재하지 않는 spaceRole 입니다.');
      }
    }

    const changeMember = await this.spaceMemberRepository.findOne({
      where: { userId: chageUserId, spaceId: spaceId },
    });

    if (!changeMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    changeMember.roleName = roleName;
    changeMember.roleType = roleType;

    await this.spaceMemberRepository.save(changeMember);

    return { success: true };
  }
}
