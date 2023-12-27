import { UserEntity } from '../entities/user.entity';

interface User extends UserEntity {}

interface CreateUserDAO {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  profileImageSrc: string;
}

export { User, CreateUserDAO };
