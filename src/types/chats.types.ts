import { ReplyChats } from './reply.chats.types';
import { ChatEntity } from '../entities/chat.entity';

interface Chat extends ChatEntity {}

interface ChatWithReplyChats extends Chat {
  replyChats: ReplyChats[];
}

export { Chat, ChatWithReplyChats };
