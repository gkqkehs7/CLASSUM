import { ReplyChatEntity } from '../entities/replyChat.entity';
import { User } from './users.interfaces';

interface ReplyChat extends ReplyChatEntity {}

interface ReplyChatWithUser extends ReplyChat {
  user: User | null;
}

interface CreateReplyChatDAO {
  content: string;
  anonymous: boolean;
  userId: number;
  postId: number;
  chatId: number;
}

export { ReplyChat, ReplyChatWithUser, CreateReplyChatDAO };
