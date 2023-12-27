import { PostEntity, PostType } from '../entities/post.entity';
import { ChatWithReplyChats } from './chats.interfaces';
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
  user: User;
  chats: ChatWithReplyChats[];
}

export { Post, CreatePostDAO, PostWithChats };
