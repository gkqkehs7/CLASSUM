import { ReplyChatWithUser } from './reply.chats.interfaces';
import { ChatEntity } from '../entities/chat.entity';
import { User } from './users.interfaces';

interface Chat extends ChatEntity {}

interface CreateChatDAO {
  content: string;
  anonymous: boolean;
  userId: number;
  postId: number;
}

interface ChatWithUser extends Chat {
  user: User | null;
  replyChats: ReplyChatWithUser[];
}

export { Chat, CreateChatDAO, ChatWithUser };
