import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { CreateReplyChatRequestDto } from '../spaces/request.dto/create.reply.chat.request.dto';
import { ReplyChatEntity } from '../../entities/replyChat.entity';
import { SuccessResponse } from '../../interfaces/common.interfaces';
import { PostsService } from '../posts/posts.service';
import { SpacesService } from '../spaces/spaces.service';
import { SpaceMembersService } from '../space.member/space.members.service';
import { ChatsService } from '../chat/chats.service';
import {
  CreateReplyChatDAO,
  ReplyChat,
} from '../../interfaces/reply.chats.interfaces';

@Injectable()
export class ReplyChatsService {
  constructor(
    @InjectRepository(ReplyChatEntity)
    private replyChatRepository: Repository<ReplyChatEntity>,
    private readonly postsService: PostsService,
    private readonly chatsService: ChatsService,
    private readonly spacesService: SpacesService,
    private readonly spaceMembersService: SpaceMembersService,
  ) {}

  /**
   * replyChatEntity 생성
   * @param createReplyChatDAO
   * @param queryRunner
   */
  async createReplyChatEntity(
    createReplyChatDAO: CreateReplyChatDAO,
    queryRunner: QueryRunner,
  ): Promise<ReplyChat> {
    const { content, anonymous, userId, chatId } = createReplyChatDAO;

    const replyChat = new ReplyChatEntity();
    replyChat.content = content;
    replyChat.anonymous = anonymous;
    replyChat.userId = userId;
    replyChat.chatId = chatId;

    if (queryRunner) {
      await queryRunner.manager.getRepository(ReplyChatEntity).save(replyChat);
    } else {
      await this.replyChatRepository.save(replyChat);
    }

    return replyChat;
  }

  /**
   * replyChatEntity 가져오기
   * @param where
   * @param relations
   */
  async getReplyChatEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<ReplyChat> {
    const replyChat = await this.replyChatRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!replyChat) {
      throw new Error('존재하지 않는 replyChat 입니다.');
    }

    return replyChat;
  }

  /**
   * replyChatEntity 삭제
   * @param replyChat
   * @param queryRunner
   */
  async deleteReplyChatEntity(
    replyChat: ReplyChatEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager
        .getRepository(ReplyChatEntity)
        .softRemove(replyChat);
    } else {
      await this.replyChatRepository.softRemove(replyChat);
    }
  }

  /**
   * replyChat 생성
   * @param userId
   * @param spaceId
   * @param postId
   * @param chatId
   * @param createReplyChatRequestDto
   */
  async createReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    createReplyChatRequestDto: CreateReplyChatRequestDto,
  ): Promise<SuccessResponse> {
    const { content, anonymous } = createReplyChatRequestDto;

    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 존재하는 post인지 확인
    await this.postsService.getPostEntity({ id: postId }, null);

    // space member만 작성 가능
    const isMember = await this.spaceMembersService.isMember(userId, spaceId);

    if (!isMember) {
      throw new Error('space 멤버만 댓글을 작성할 수 있습니다.');
    }

    // 익명인 경우 참여자만 작성 가능
    if (anonymous) {
      const isParticipate = await this.spaceMembersService.isParticipate(
        userId,
        spaceId,
      );

      if (!isParticipate) {
        throw new Error('참여자만 댓글을 익명으로 작성할 수 있습니다.');
      }
    }

    // replyChatEntity 생성
    await this.createReplyChatEntity(
      {
        content: content,
        anonymous: anonymous,
        userId: userId,
        postId: 1,
        chatId: chatId,
      },
      null,
    );

    return { success: true };
  }

  /**
   * replyChat 삭제
   * @param userId
   * @param spaceId
   * @param postId
   * @param chatId
   * @param replyChatId
   */
  async deleteReplyChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
    replyChatId: number,
  ): Promise<SuccessResponse> {
    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 존재하는 post인지 확인
    await this.postsService.getPostEntity({ id: postId }, null);

    // 존재하는 chat인지 확인
    await this.chatsService.getChatEntity({ id: chatId }, ['replyChats']);

    // 존재하는 replyChat인지 확인
    const replyChat = await this.getReplyChatEntity({ id: chatId }, null);

    await this.deleteReplyChatEntity(replyChat, null);

    return { success: true };
  }
}
