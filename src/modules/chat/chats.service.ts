import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { Repository } from 'typeorm';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { SuccessResponse } from '../../types/common.types';
import { CreateChatRequestDto } from '../spaces/request.dto/create.chat.request.dto';
import { SpaceRoleType } from '../../entities/spaceRole.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
    @InjectRepository(ChatEntity)
    private chatRepository: Repository<ChatEntity>,
  ) {}

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

    const chat = new ChatEntity();
    chat.content = content;
    chat.anonymous = anonymous;
    chat.userId = userId;
    chat.postId = postId;

    await this.chatRepository.save(chat);

    return { success: true };
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
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const chat = await this.chatRepository.findOne({
      where: { id: chatId },
      relations: ['replyChats'],
    });

    if (!chat) {
      throw new Error('존재하지 않는 chat 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    const role = spaceMember.roleType;

    if (role !== SpaceRoleType.ADMIN && chat.userId !== userId) {
      throw new Error('작성자나 관리자만 댓글을 삭제할 수 있습니다.');
    }

    await this.chatRepository.softRemove(chat);

    return { success: true };
  }
}
