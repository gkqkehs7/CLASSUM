import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { Repository } from 'typeorm';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { CreateReplyChatRequestDto } from '../spaces/request.dto/create.reply.chat.request.dto';
import { ReplyChatEntity } from '../../entities/replyChat.entity';
import { SuccessResponse } from '../../types/common.types';

@Injectable()
export class ReplyChatsService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberEntityRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(PostEntity)
    private postEntityRepository: Repository<PostEntity>,
    @InjectRepository(ChatEntity)
    private chatEntityRepository: Repository<ChatEntity>,
    @InjectRepository(ReplyChatEntity)
    private replyChatEntityRepository: Repository<ReplyChatEntity>,
  ) {}

  async createReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    createReplyChatRequestDto: CreateReplyChatRequestDto,
  ): Promise<SuccessResponse> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberEntityRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space 멤버만 댓글을 작성할 수 있습니다.');
    }

    const post = await this.postEntityRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    const { content, anonymous } = createReplyChatRequestDto;

    const replyChat = new ReplyChatEntity();
    replyChat.content = content;
    replyChat.anonymous = anonymous;
    replyChat.userId = userId;
    replyChat.chatId = postId;

    await this.replyChatEntityRepository.save(replyChat);

    return { success: true };
  }

  async deleteReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    replyChatId: number,
  ): Promise<SuccessResponse> {
    const post = await this.postEntityRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    const chat = await this.chatEntityRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    const replyChat = await this.replyChatEntityRepository.findOne({
      where: { id: replyChatId },
    });

    if (!replyChat) {
      throw new Error('존재하지 않는 답글입니다.');
    }

    await this.replyChatEntityRepository.softRemove(replyChat);

    return { success: true };
  }
}
