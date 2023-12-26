import { UserEntity } from '../entities/user.entity';
import { User } from './users.types';
import { SpaceEntity } from '../entities/space.entity';
import { Space } from './spaces.types';

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

  static space(space: SpaceEntity): Space {
    return {
      id: space.id,
      name: space.name,
      logo: space.logo,
      code: space.code,
      adminCode: space.adminCode,
    };
  }
}
