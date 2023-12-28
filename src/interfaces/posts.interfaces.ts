import { PostEntity, PostType } from '../entities/post.entity';
import { ChatWithUser } from './chats.interfaces';
import { User } from './users.interfaces';

interface Post extends PostEntity {}

interface CreatePostDAO {
  title: string;
  content: string;
  fileSrc: string;
  anonymous: boolean;
  postType: PostType;
  userId: number;
  spaceId: number;
}

interface UpdatePostDAO {
  title: string;
  content: string;
  fileSrc: string;
  anonymous: boolean;
  postType: PostType;
}

interface PostWithChats extends Post {
  user: User | null;
  chats: ChatWithUser[];
}

export { Post, CreatePostDAO, UpdatePostDAO, PostWithChats };
