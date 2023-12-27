import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { Repository } from 'typeorm';
import {
  SpaceRoleEntity,
  SpaceRoleType,
} from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity, PostType } from '../../entities/post.entity';
import { CreatePostRequestDto } from '../spaces/request.dto/create.post.request.dto';
import { SuccessResponse } from '../../types/common.types';
import { ModelConverter } from '../../types/model.converter';
import { PostWithChats } from '../../types/posts.types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(SpaceEntity)
    private spaceRepository: Repository<SpaceEntity>,
    @InjectRepository(SpaceRoleEntity)
    private spaceRoleRepository: Repository<SpaceRoleEntity>,
    @InjectRepository(SpaceMemberEntity)
    private spaceMemberRepository: Repository<SpaceMemberEntity>,
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,
  ) {}

  async createPost(
    userId: number,
    spaceId: number,
    postType: PostType,
    createPostRequestDto: CreatePostRequestDto,
  ): Promise<SuccessResponse> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    const role = spaceMember.roleType;

    const { title, content, anonymous } = createPostRequestDto;

    if (
      postType === PostType.NOTIFICATION &&
      role === SpaceRoleType.PARTICIPANT
    ) {
      throw new Error('관리자만 공지글을 작성할 수 있습니다.');
    }

    if (anonymous && role === SpaceRoleType.PARTICIPANT) {
      throw new Error('참여자만 게시글을 익명으로 작성할 수 있습니다.');
    }

    const post = new PostEntity();
    post.title = title;
    post.content = content;
    post.anonymous = anonymous;
    post.type = postType;
    post.userId = userId;
    post.spaceId = spaceId;

    await this.postRepository.save(post);

    return { success: true };
  }

  async getPost(
    userId: number,
    spaceId: number,
    postId: number,
  ): Promise<PostWithChats> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: [
        'user',
        'chats',
        'chats.replyChats',
        'chats.user',
        'chats.replyChats.user',
      ],
    });

    if (!post) {
      throw new Error('존재하지 않는 post 입니다.');
    }

    return post;
  }

  async deletePost(
    userId: number,
    spaceId: number,
    postId: number,
  ): Promise<SuccessResponse> {
    const space = await this.spaceRepository.findOne({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error('존재하지 않는 space 입니다.');
    }

    const spaceMember = await this.spaceMemberRepository.findOne({
      where: { userId: userId, spaceId: spaceId },
    });

    const role = spaceMember.roleType;

    if (role !== SpaceRoleType.ADMIN) {
      throw new Error('관리자만 공지글을 삭제할 수 있습니다.');
    }

    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['chats', 'chat.replyChats', 'images'],
    });

    if (!post) {
      throw new Error('존재하지 않는 post 입니다.');
    }

    await this.postRepository.softRemove(post);

    return { success: true };
  }
}
