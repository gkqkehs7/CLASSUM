import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities/user.entity';
import { ModelConverter } from '../../types/model.converter';
import { CreateUserDAO, User } from '../../types/users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  /**
   * 존재하는 유저인지 확인
   * @param email
   */
  async userExists(email: string): Promise<boolean> {
    const isExist = await this.userRepository.findOne({
      where: { email: email },
    });

    // boolean casting
    return !!isExist;
  }

  /**
   * 이메일로 유저 검색
   * @param email
   */
  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new Error('존재하지 않는 이메일입니다.');
    }

    return ModelConverter.user(user);
  }

  /**
   * 유저 생성
   * @param createUserDAO
   */
  async createUser(createUserDAO: CreateUserDAO): Promise<User> {
    const { email, hashedPassword, firstName, lastName, profileImageSrc } =
      createUserDAO;

    const user = new UserEntity();
    user.email = email;
    user.password = hashedPassword;
    user.firstName = firstName;
    user.lastName = lastName;
    user.profileImageSrc = profileImageSrc;

    await this.userRepository.save(user);

    return ModelConverter.user(user);
  }
}
