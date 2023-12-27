import { PostEntity } from '../entities/post.entity';
import { ChatWithReplyChats } from './chats.types';
import { User } from './users.types';

interface Post extends PostEntity {}

interface PostWithChats extends Post {
  user: User;
  chats: ChatWithReplyChats[];
}

export { Post, PostWithChats };
