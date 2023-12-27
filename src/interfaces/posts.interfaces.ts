import { PostEntity, PostType } from '../entities/post.entity';
import { ChatWithUser } from './chats.interfaces';
import { User } from './users.interfaces';

interface Post extends PostEntity {}

interface CreatePostDAO {
  title: string;
  content: string;
  anonymous: boolean;
  postType: PostType;
  userId: number;
  spaceId: number;
}

interface PostWithChats extends Post {
  user: User | null;
  chats: ChatWithUser[];
}

export { Post, CreatePostDAO, PostWithChats };
