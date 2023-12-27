import { ReplyChatEntity } from '../entities/replyChat.entity';

interface ReplyChat extends ReplyChatEntity {}

interface CreateReplyChatDAO {
  content: string;
  anonymous: boolean;
  userId: number;
  postId: number;
  chatId: number;
}

export { ReplyChat, CreateReplyChatDAO };
