import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { CreateSpaceRequestDto } from './request.dto/create.space.request.dto';
import { SpaceEntity } from '../../entities/space.entity';
import {
  SpaceRoleEntity,
  SpaceRoleType,
} from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import {
  CreateSpaceMemberDAO,
  CreateSpaceReponse,
  DeleteSpaceResponse,
  EntranceSpaceResponse,
  Space,
} from '../../types/spaces.types';
import { UsersService } from '../users/users.service';
import { SpaceRolesService } from '../spaceRole/spaceRoles.service';
import { EntranceSpaceRequestDto } from './request.dto/entrance.space.request.dto';
import { UserEntity } from '../../entities/user.entity';
import { ModelConverter } from '../../types/model.converter';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRoleRepository: Repository<SpaceRoleEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceMemberEntityRepository: Repository<SpaceMemberEntity>,
    private usersService: UsersService,
    private spaceRolesService: SpaceRolesService,
    private readonly connection: Connection,
  ) {}

  /**
   * space 생성
   * @param userId
   * @param createSpaceRequestDto
   */
  async createSpace(
    userId: number,
    createSpaceRequestDto: CreateSpaceRequestDto,
  ): Promise<CreateSpaceReponse> {
    const { name, logo, code, adminCode, roleNames } = createSpaceRequestDto;

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const space = new SpaceEntity();
      space.name = name;
      space.logo = logo;
      space.code = code;
      space.adminCode = adminCode;

      await queryRunner.manager.getRepository(SpaceEntity).save(space);

      // space 역할들 생성
      await Promise.all(
        roleNames.map(async (roleName) => {
          await this.spaceRolesService.createSpaceRole(
            {
              spaceId: space.id,
              roleName: roleName,
            },
            queryRunner,
          );
        }),
      );

      // 관리자로 자신 추가
      await this.addSpaceMember(
        {
          userId: userId,
          spaceId: space.id,
          roleName: 'ADMIN',
          roleType: SpaceRoleType.ADMIN,
        },
        queryRunner,
      );

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async getSpaces(userId: number): Promise<Space[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['spaces'],
    });

    if (user.spaces.length === 0) return [];

    return user.spaces.map((space) => ModelConverter.space(space));
  }

  /**
   * space 생성
   * @param userId
   * @param spaceId
   */
  async deleteSpace(
    userId: number,
    spaceId: number,
  ): Promise<DeleteSpaceResponse> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
      relations: ['posts', 'spaceRoles'],
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberEntityRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    if (spaceMember.roleType !== SpaceRoleType.ADMIN) {
      throw new Error('관리자만 space를 삭제할 수 있습니다.');
    }

    await this.spaceRepository.softRemove(space);

    return { success: true };
  }

  async entranceSpace(
    userId: number,
    spaceId: number,
    entranceSpaceRequestDto: EntranceSpaceRequestDto,
  ): Promise<EntranceSpaceResponse> {
    const { entranceCode } = entranceSpaceRequestDto;

    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberEntityRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    const { code, adminCode } = space;

    if (code !== entranceCode && adminCode !== entranceCode) {
      throw new Error('잘못된 코드 입니다.');
    }

    if (entranceCode === adminCode) {
      if (spaceMember.roleType !== SpaceRoleType.ADMIN) {
        throw new Error('관리자만 관리자 코드로 입장 가능합니다.');
      }
    }

    return { success: true };
  }

  /**
   * space에 member 추가
   * @param createSpaceMemberDAO
   * @param queryRunner
   */
  async addSpaceMember(
    createSpaceMemberDAO: CreateSpaceMemberDAO,
    queryRunner: QueryRunner,
  ): Promise<void> {
    const { userId, spaceId, roleName, roleType } = createSpaceMemberDAO;

    const spaceMember = new SpaceMemberEntity();

    spaceMember.userId = userId;
    spaceMember.spaceId = spaceId;
    spaceMember.roleName = roleName;
    spaceMember.roleType = roleType;

    await queryRunner.manager
      .getRepository(SpaceMemberEntity)
      .save(spaceMember);
  }
}
