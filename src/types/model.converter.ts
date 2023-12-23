import { UserEntity } from '../entities/user.entity';
import { User } from './users.types';

export class ModelConverter {
  static user(user: UserEntity): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      profileImageSrc: user.profileImageSrc,
    };
  }
}
