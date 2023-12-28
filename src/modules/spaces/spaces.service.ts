import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection, QueryRunner } from 'typeorm';
import { CreateSpaceRequestDto } from './request.dto/create.space.request.dto';
import { SpaceEntity } from '../../entities/space.entity';
import { SpaceRoleType } from '../../entities/spaceRole.entity';
import { CreateSpaceDAO, Space } from '../../interfaces/spaces.interfaces';
import { SpaceRolesService } from '../space.roles/space.roles.service';
import { EntranceSpaceRequestDto } from './request.dto/entrance.space.request.dto';
import { SuccessResponse } from '../../interfaces/common.interfaces';
import { SpaceMembersService } from '../space.member/space.members.service';

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @Inject(forwardRef(() => SpaceRolesService))
    private spaceRolesService: SpaceRolesService,
    private spaceMembersService: SpaceMembersService,
    private readonly connection: Connection,
  ) {}

  /**
   * spaceEntity 생성
   * @param createSpaceDAO
   * @param queryRunner
   */
  async createSpaceEntity(
    createSpaceDAO: CreateSpaceDAO,
    queryRunner: QueryRunner,
  ): Promise<Space> {
    const { name, logo, code, adminCode } = createSpaceDAO;

    const space = new SpaceEntity();
    space.name = name;
    space.logo = logo;
    space.code = code;
    space.adminCode = adminCode;

    if (queryRunner) {
      await queryRunner.manager.getRepository(SpaceEntity).save(space);
    } else {
      await this.spaceRepository.save(space);
    }

    return space;
  }

  /**
   * spaceEntity 가져오기
   * @param where
   * @param relations
   */
  async getSpaceEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<Space> {
    const space = await this.spaceRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    return space;
  }

  /**
   * spaceEntity 삭제
   * @param space
   * @param queryRunner
   */
  async deleteSpaceEntity(
    space: SpaceEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.getRepository(SpaceEntity).softRemove(space);
    } else {
      await this.spaceRepository.softRemove(space);
    }
  }

  /**
   * space 생성
   * @param userId
   * @param createSpaceRequestDto
   */
  async createSpace(
    userId: number,
    createSpaceRequestDto: CreateSpaceRequestDto,
  ): Promise<SuccessResponse> {
    const {
      name,
      logo,
      code,
      adminCode,
      roleName,
      adminRoleNames,
      partRoleNames,
    } = createSpaceRequestDto;

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // spaceEntity 생성
      const space = await this.createSpaceEntity(
        {
          name: name,
          logo: logo,
          code: code,
          adminCode: adminCode,
        },
        queryRunner,
      );

      // space 역할들 생성
      await Promise.all([
        adminRoleNames.map(async (roleName) => {
          await this.spaceRolesService.createSpaceRoleEntity(
            {
              spaceId: space.id,
              roleName: roleName,
              roleType: SpaceRoleType.ADMIN,
            },
            queryRunner,
          );
        }),
        partRoleNames.map(async (roleName) => {
          await this.spaceRolesService.createSpaceRoleEntity(
            {
              spaceId: space.id,
              roleName: roleName,
              roleType: SpaceRoleType.PARTICIPANT,
            },
            queryRunner,
          );
        }),
      ]);

      // spaceMemberEntity 생성, 관리자로 자신 추가
      await this.spaceMembersService.createSpaceMemberEntity(
        {
          userId: userId,
          spaceId: space.id,
          roleName: roleName,
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

  /**
   * space 삭제
   * @param userId
   * @param spaceId
   */
  async deleteSpace(userId: number, spaceId: number): Promise<SuccessResponse> {
    // 존재하는 space인지 확인
    const space = await this.getSpaceEntity({ id: spaceId }, [
      'posts',
      'spaceRoles',
    ]);

    // 관리자만 space 삭제 가능
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (!isAdmin) {
      throw new Error('관리자만 space를 삭제할 수 있습니다.');
    }

    // spaceEntity 삭제
    await this.deleteSpaceEntity(space, null);

    return { success: true };
  }

  /**
   * space 입장
   * @param userId
   * @param spaceId
   * @param entranceSpaceRequestDto
   */
  async entranceSpace(
    userId: number,
    spaceId: number,
    entranceSpaceRequestDto: EntranceSpaceRequestDto,
  ): Promise<SuccessResponse> {
    const { entranceCode, roleName } = entranceSpaceRequestDto;

    // 존재하는 space인지 확인
    const space = await this.getSpaceEntity({ id: spaceId }, null);

    const { code, adminCode } = space;

    // 코드가 맞는지 확인
    if (code !== entranceCode && adminCode !== entranceCode) {
      throw new Error('잘못된 코드 입니다.');
    }

    if (entranceCode === code) {
      // 참여자로 참여
      await this.spaceMembersService.createSpaceMemberEntity(
        {
          userId: userId,
          spaceId: spaceId,
          roleName: roleName,
          roleType: SpaceRoleType.PARTICIPANT,
        },
        null,
      );
    } else if (entranceCode === adminCode) {
      // 관리자로 참여
      await this.spaceMembersService.createSpaceMemberEntity(
        {
          userId: userId,
          spaceId: spaceId,
          roleName: roleName,
          roleType: SpaceRoleType.ADMIN,
        },
        null,
      );
    }

    return { success: true };
  }
}
