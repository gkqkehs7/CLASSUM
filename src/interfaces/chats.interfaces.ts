import { ReplyChats } from './reply.chats.interfaces';
import { ChatEntity } from '../entities/chat.entity';

interface Chat extends ChatEntity {}

interface CreateChatDAO {
  content: string;
  anonymous: boolean;
  userId: number;
  postId: number;
}

interface ChatWithReplyChats extends Chat {
  replyChats: ReplyChats[];
}

export { Chat, CreateChatDAO, ChatWithReplyChats };
