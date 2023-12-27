import { ReplyChatEntity } from '../entities/replyChat.entity';

interface ReplyChats extends ReplyChatEntity {}

interface CreateReplyChatDAO {
  content: string;
  anonymous: boolean;
  userId: number;
  postId: number;
  chatId: number;
}

export { ReplyChats, CreateReplyChatDAO };
