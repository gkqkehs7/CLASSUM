import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CreateSpaceRoleDAO,
  DeleteSpaceRoleResponse,
  UpdateUserSpaceRoleResponse,
} from '../../types/space.roles.types';
import { QueryRunner, Repository } from 'typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { DeleteSpaceRoleRequestDto } from '../spaces/request.dto/delete.space.role.request.dto';
import { UpdateUserSpaceRoleRequestDto } from '../spaces/request.dto/update.user.space.role.request.dto';
import { SpaceMembersService } from '../space.member/space.members.service';
import { SpacesService } from '../spaces/spaces.service';

@Injectable()
export class SpaceRolesService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRoleRepository: Repository<SpaceRoleEntity>,
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
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
  ): Promise<SpaceRoleEntity> {
    const { spaceId, roleName, roleType } = createSpaceRoleDAO;

    const spaceRole = new SpaceRoleEntity();
    spaceRole.spaceId = spaceId;
    spaceRole.roleName = roleName;
    spaceRole.roleType = roleType;

    if (queryRunner) {
      await queryRunner.manager.getRepository(SpaceRoleEntity).save(spaceRole);
    } else {
      await this.spaceRoleRepository.save(spaceRole);
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
  ): Promise<SpaceRoleEntity> {
    const spaceRole = await this.spaceRoleRepository.findOne({
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
      await this.spaceRepository.softRemove(spaceRole);
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
  ): Promise<DeleteSpaceRoleResponse> {
    const { roleName } = deleteSpaceRoleRequestDto;

    await this.spacesService.getSpaceEntity({ id: spaceId }, ['spaceRoles']);

    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (!isAdmin) {
      throw new Error('관리자만 spaceRole을 삭제할 수 있습니다.');
    }

    const spaceRole = await this.getSpaceRoleEntity(
      {
        spaceId: spaceId,
        roleName: roleName,
      },
      null,
    );

    const isUsed = await this.spaceMemberRepository.findOne({
      where: { spaceId: spaceId, roleName: roleName },
    });

    if (!isUsed) {
      throw new Error('해당 spaceRole을 사용하는 유저가 존재합니다.');
    }

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
    chageUserId: number,
    spaceId: number,
    updateUserSpaceRoleRequestDto: UpdateUserSpaceRoleRequestDto,
  ): Promise<UpdateUserSpaceRoleResponse> {
    const { roleName, roleType } = updateUserSpaceRoleRequestDto;

    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (!isAdmin) {
      throw new Error('관리자만 spaceRole을 변경할 수 있습니다.');
    }

    // 해당 역할이 존재하는지 확인
    await this.getSpaceRoleEntity(
      { roleName: roleName, roleType: roleType },
      null,
    );

    const isMember = await this.spaceMembersService.isMember(
      chageUserId,
      spaceId,
    );

    if (!isMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    // changeMember.roleName = roleName;
    // changeMember.roleType = roleType;
    //
    // await this.spaceMemberRepository.save(changeMember);

    return { success: true };
  }
}
