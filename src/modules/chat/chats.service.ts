import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';

import { ChatEntity } from '../../entities/chat.entity';

import { CreateChatRequestDto } from '../spaces/request.dto/create.chat.request.dto';
import { SuccessResponse } from '../../interfaces/common.interfaces';
import { Chat, CreateChatDAO } from '../../interfaces/chats.interfaces';

import { SpacesService } from '../spaces/spaces.service';
import { SpaceMembersService } from '../space.member/space.members.service';
import { PostsService } from '../posts/posts.service';
import { AlarmsService } from '../alarms/alarms.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
    private readonly postsService: PostsService,
    private readonly spacesService: SpacesService,
    private readonly spaceMembersService: SpaceMembersService,
    private alarmsService: AlarmsService,
    private readonly connection: Connection,
  ) {}

  /**
   * chatEntity 생성
   * @param createChatDAO
   * @param queryRunner
   */
  async createChatEntity(
    createChatDAO: CreateChatDAO,
    queryRunner: QueryRunner,
  ): Promise<Chat> {
    const { content, anonymous, userId, postId } = createChatDAO;

    const chat = new ChatEntity();
    chat.content = content;
    chat.anonymous = anonymous;
    chat.userId = userId;
    chat.postId = postId;

    if (queryRunner) {
      await queryRunner.manager.getRepository(ChatEntity).save(chat);
    } else {
      await this.chatRepository.save(chat);
    }

    return chat;
  }

  /**
   * chatEntity 가져오기
   * @param where
   * @param relations
   */
  async getChatEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!chat) {
      throw new Error('존재하지 않는 chat 입니다.');
    }

    return chat;
  }

  /**
   * chatEntity 삭제
   * @param chat
   * @param queryRunner
   */
  async deleteChatEntity(
    chat: ChatEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.getRepository(ChatEntity).softRemove(chat);
    } else {
      await this.chatRepository.softRemove(chat);
    }
  }

  /**
   * 채팅 생성
   * @param userId
   * @param spaceId
   * @param postId
   * @param createChatRequestDto
   */
  async createChat(
    userId: number,
    spaceId: number,
    postId: number,
    createChatRequestDto: CreateChatRequestDto,
  ): Promise<SuccessResponse> {
    const { content, anonymous } = createChatRequestDto;

    // 존재하는 space인지 확인
    const space = await this.spacesService.getSpaceEntity({ id: spaceId }, [
      'members',
    ]);

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

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // chatEntity 생성
      await this.createChatEntity(
        {
          content: content,
          anonymous: anonymous,
          userId: userId,
          postId: postId,
        },
        queryRunner,
      );

      // user들에게 알람 전송
      await Promise.all(
        space.members.map((user) => {
          if (user.id !== userId) {
            return this.alarmsService.createAlarmEntity(
              {
                userId: user.id,
                postId: postId,
                spaceId: space.id,
                content: '새로운 댓글입니다.',
                priority: 2,
              },
              queryRunner,
            );
          }
        }),
      );

      await queryRunner.commitTransaction();

      return { success: true };
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 채팅 삭제
   * @param userId
   * @param spaceId
   * @param postId
   * @param chatId
   */
  async deleteChat(
    userId: number,
    spaceId: number,
    postId: number,
    chatId: number,
  ): Promise<SuccessResponse> {
    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 존재하는 chat인지 확인
    const chat = await this.getChatEntity({ id: chatId }, ['replyChats']);

    // 관리자인지 확인
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    // 관리자나 작성자만 삭제 가능
    if (!isAdmin && chat.userId === userId) {
      throw new Error('작성자나 관리자만 댓글을 삭제할 수 있습니다.');
    }

    // chat 삭제
    await this.deleteChatEntity(chat, null);

    return { success: true };
  }
}
