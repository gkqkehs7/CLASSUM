import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { SpaceRoleType } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import {
  CreateSpaceMemberDAO,
  SpaceMember,
} from '../../interfaces/space.members.interfaces';

@Injectable()
export class SpaceMembersService {
  constructor(
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
  ) {}

  /**
   * spaceMemberEntity 생성
   * @param createSpaceMemberDAO
   * @param queryRunner
   */
  async createSpaceMemberEntity(
    createSpaceMemberDAO: CreateSpaceMemberDAO,
    queryRunner: QueryRunner,
  ): Promise<SpaceMember> {
    const { userId, spaceId, roleName, roleType } = createSpaceMemberDAO;

    const spaceMember = new SpaceMemberEntity();

    spaceMember.userId = userId;
    spaceMember.spaceId = spaceId;
    spaceMember.roleName = roleName;
    spaceMember.roleType = roleType;

    if (queryRunner) {
      await queryRunner.manager
        .getRepository(SpaceMemberEntity)
        .save(spaceMember);
    } else {
      await this.spaceMemberRepository.save(spaceMember);
    }

    return spaceMember;
  }

  /**
   * 멤버인지 확인
   * @param userId
   * @param spaceId
   */
  async isMember(userId: number, spaceId: number): Promise<boolean> {
    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    return !!spaceMember;
  }

  /**
   * 관리자 권한인지 확인
   * @param userId
   * @param spaceId
   */
  async isAdmin(userId: number, spaceId: number): Promise<boolean> {
    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    return spaceMember.roleType === SpaceRoleType.ADMIN;
  }

  /**
   * 참여자 권환인지 확인
   * @param userId
   * @param spaceId
   */
  async isParticipate(userId: number, spaceId: number): Promise<boolean> {
    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space의 member가 아닙니다.');
    }

    return spaceMember.roleType === SpaceRoleType.PARTICIPANT;
  }
}
