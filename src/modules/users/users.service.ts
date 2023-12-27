import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { CreateUserDAO, User } from '../../interfaces/users.interfaces';
import { PostsService } from '../posts/posts.service';
import { ChatsService } from '../chat/chats.service';
import { SpacesService } from '../spaces/spaces.service';
import { ReplyChatsService } from '../reply.chats/reply.chats.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly spacesService: SpacesService,
    private readonly postsService: PostsService,
    private readonly chatsService: ChatsService,
    private readonly replyChatsService: ReplyChatsService,
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
    const user = await this.getUserEntity({ id: otherId }, null);

    return user;
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
  async getMySpaces(userId: number) {
    console.log('hi');
  }

  /**
   * 내가 작성한 게시글들 가져오기
   * @param userId
   */
  async getMyPosts(userId: number) {
    console.log('hi');
  }

  /**
   * 내가 작성한 댓글들 가져오기
   * @param userId
   */
  async getMyChats(userId: number) {
    console.log('hi');
  }
}
