import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDAO, User } from '../../interfaces/users.interfaces';
import { Space } from '../../interfaces/spaces.interfaces';
import { Post } from '../../interfaces/posts.interfaces';
import { Chat } from '../../interfaces/chats.interfaces';
import { ReplyChat } from '../../interfaces/reply.chats.interfaces';
import { Alarm } from '../../interfaces/alarm.interfaces';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * userEntity 생성
   * @param createUserDAO
   * @param queryRunner
   */
  async createUserEntity(
    createUserDAO: CreateUserDAO,
    queryRunner: QueryRunner,
  ): Promise<User> {
    const { email, hashedPassword, firstName, lastName, profileImageSrc } =
      createUserDAO;

    const user = new UserEntity();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.profileImageSrc = profileImageSrc;

    if (queryRunner) {
      await queryRunner.manager.getRepository(UserEntity).save(user);
    } else {
      await this.userRepository.save(user);
    }

    return user;
  }

  /**
   * email로 유저 검색
   * @param email
   */
  async getUserEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!user) {
      throw new Error('존재하지 않는 user 입니다.');
    }

    return user;
  }

  /**
   * 존재하는 유저인지 email로 확인
   * @param email
   */
  async userExistsByEmail(email: string): Promise<boolean> {
    const isExist = await this.userRepository.findOne({
      where: { email: email },
    });

    // boolean casting
    return !!isExist;
  }

  /**
   * 다른 사람 프로필 가져오기
   * @param userId
   */
  async getUserInfo(userId: number, otherId: number): Promise<User> {
    return await this.getUserEntity({ id: otherId }, null);
  }

  /**
   * 자신의 프로필 가져오기
   * @param userId
   */
  async getMyInfo(userId: number): Promise<User> {
    return await this.getUserEntity({ id: userId }, null);
  }

  /**
   * 나의 공간들 가져오기
   * @param userId
   */
  async getMySpaces(userId: number): Promise<Space[]> {
    const user = await this.getUserEntity({ id: userId }, ['spaces']);

    return user.spaces;
  }

  /**
   * 내가 작성한 게시글들 가져오기
   * @param userId
   */
  async getMyPosts(userId: number): Promise<Post[]> {
    const user = await this.getUserEntity({ id: userId }, ['posts']);

    return user.posts;
  }

  /**
   * 내가 작성한 댓글들 가져오기
   * @param userId
   */
  async getMyChats(userId: number): Promise<Chat[]> {
    const user = await this.getUserEntity({ id: userId }, ['chats']);

    return user.chats;
  }

  /**
   * 내가 작성한 답글들 가져오기
   * @param userId
   */
  async getMyReplyChats(userId: number): Promise<ReplyChat[]> {
    const user = await this.getUserEntity({ id: userId }, ['replyChats']);

    return user.replyChats;
  }

  async getMyAlarms(userId: number): Promise<Alarm[]> {
    const user = await this.getUserEntity({ id: userId }, ['spaces', 'alarms']);

    const alarmsGroupedBySpace: { [spaceId: number]: Alarm[] } = {};

    // space별로 알람 분리
    user.alarms.forEach((alarm) => {
      const spaceId = alarm.spaceId;

      if (!alarmsGroupedBySpace[spaceId]) {
        alarmsGroupedBySpace[spaceId] = [alarm];
      } else {
        alarmsGroupedBySpace[spaceId].push(alarm);
      }
    });

    const spaceIds = Object.keys(alarmsGroupedBySpace);

    const priorityAlarmGroupedBySpace: Alarm[] = [];

    // 가장 우선순위가 높은 알람만 유저에게 보여주기기
    for (const spaceId of spaceIds) {
      const alarms = alarmsGroupedBySpace[spaceId];

      const alarm = alarms.reduce((alarm, currentAlarm) => {
        return currentAlarm.priority < alarm.priority ? currentAlarm : alarm;
      }, alarms[0]);

      priorityAlarmGroupedBySpace.push(alarm);
    }

    return priorityAlarmGroupedBySpace;
  }
}
