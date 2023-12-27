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
import { SpaceRoleType } from '../../entities/spaceRole.entity';

@Injectable()
export class ReplyChatsService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    @InjectRepository(ReplyChatEntity)
    private replyChatRepository: Repository<ReplyChatEntity>,
  ) {}

  async createReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    createReplyChatRequestDto: CreateReplyChatRequestDto,
  ): Promise<SuccessResponse> {
    const { content, anonymous } = createReplyChatRequestDto;

    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    if (!spaceMember) {
      throw new Error('space 멤버만 댓글을 작성할 수 있습니다.');
    }

    const role = spaceMember.roleType;

    if (anonymous && role === SpaceRoleType.ADMIN) {
      throw new Error('참여자만 댓글을 익명으로 작성할 수 있습니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    const replyChat = new ReplyChatEntity();
    replyChat.content = content;
    replyChat.anonymous = anonymous;
    replyChat.userId = userId;
    replyChat.chatId = postId;

    await this.replyChatRepository.save(replyChat);

    return { success: true };
  }

  async deleteReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    replyChatId: number,
  ): Promise<SuccessResponse> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('존재하지 않는 게시글입니다.');
    }

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
    });

    if (!chat) {
      throw new Error('존재하지 않는 댓글입니다.');
    }

    const replyChat = await this.replyChatRepository.findOne({
      where: { id: replyChatId },
    });

    if (!replyChat) {
      throw new Error('존재하지 않는 답글입니다.');
    }

    await this.replyChatRepository.softRemove(replyChat);

    return { success: true };
  }
}
