type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  profileImageSrc: string;
};

type CreateUserDAO = {
  email: string;
  hashedPassword: string;
  firstName: string;
  lastName: string;
  profileImageSrc: string;
};

export type { User, CreateUserDAO };
