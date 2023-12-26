import { Injectable } from '@nestjs/common';
import { CreateChatRequestDto } from './dto/create.chat.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { Repository } from 'typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity } from '../../entities/post.entity';
import { ChatEntity } from '../../entities/chat.entity';
import { SuccessResponse } from '../../types/common.types';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRoleRepository: Repository<SpaceRoleEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceMemberEntityRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(PostEntity)
    private postEntityRepository: Repository<PostEntity>,
    @InjectRepository(ChatEntity)
    private chatEntityRepository: Repository<ChatEntity>,
  ) {}

  async createChat(
    userId: number,
    spaceId: number,
    postId: number,
    createChatRequestDto: CreateChatRequestDto,
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

    const { content, anonymous } = createChatRequestDto;

    const chat = new ChatEntity();
    chat.content = content;
    chat.anonymous = anonymous;
    chat.userId = userId;
    chat.postId = postId;

    await this.chatEntityRepository.save(chat);

    return { success: true };
  }
}
