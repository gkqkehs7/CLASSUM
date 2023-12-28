import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { PostEntity, PostType } from '../../entities/post.entity';
import { CreatePostRequestDto } from '../spaces/request.dto/create.post.request.dto';
import { SuccessResponse } from '../../interfaces/common.interfaces';
import {
  CreatePostDAO,
  Post,
  PostWithChats,
  UpdatePostDAO,
} from '../../interfaces/posts.interfaces';
import { SpacesService } from '../spaces/spaces.service';
import { SpaceMembersService } from '../space.member/space.members.service';
import { AlarmsService } from '../alarms/alarms.service';
import { UpdatePostRequestDto } from '../spaces/request.dto/update.post.request.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private postRepository: Repository<PostEntity>,

    private readonly spacesService: SpacesService,
    private readonly spaceMembersService: SpaceMembersService,
    private alarmsService: AlarmsService,
    private readonly connection: Connection,
  ) {}

  /**
   * postEntity 생성
   * @param createPostDAO
   * @param queryRunner
   */
  async createPostEntity(
    createPostDAO: CreatePostDAO,
    queryRunner: QueryRunner,
  ): Promise<Post> {
    const { title, content, anonymous, postType, userId, spaceId } =
      createPostDAO;

    const post = new PostEntity();
    post.title = title;
    post.content = content;
    post.anonymous = anonymous;
    post.type = postType;
    post.userId = userId;
    post.spaceId = spaceId;

    if (queryRunner) {
      await queryRunner.manager.getRepository(PostEntity).save(post);
    } else {
      await this.postRepository.save(post);
    }

    return post;
  }

  /**
   * postEntity 가져오기
   * @param where
   * @param relations
   */
  async getPostEntity(
    where: { [key: string]: any },
    relations: string[] | null,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!post) {
      throw new Error('존재하지 않는 post 입니다.');
    }

    return post;
  }

  async updatePostEntity(
    post: PostEntity,
    updatePostEntity: UpdatePostDAO,
    queryRunner: QueryRunner,
  ): Promise<PostEntity> {
    const { title, content, anonymous, postType } = updatePostEntity;

    post.title = title;
    post.content = content;
    post.anonymous = anonymous;
    post.type = postType;

    if (queryRunner) {
      await queryRunner.manager.getRepository(PostEntity).save(post);
    } else {
      await this.postRepository.save(post);
    }

    return post;
  }

  /**
   * postEntity 삭제
   * @param post
   * @param queryRunner
   */
  async deletePostEntity(
    post: PostEntity,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (queryRunner) {
      await queryRunner.manager.getRepository(PostEntity).softRemove(post);
    } else {
      await this.postRepository.softRemove(post);
    }
  }

  /**
   * post 생성
   * @param userId
   * @param spaceId
   * @param postType
   * @param createPostRequestDto
   */
  async createPost(
    userId: number,
    spaceId: number,
    postType: PostType,
    createPostRequestDto: CreatePostRequestDto,
  ): Promise<SuccessResponse> {
    const { title, content, anonymous } = createPostRequestDto;

    // 존재하는 space인지 확인
    const space = await this.spacesService.getSpaceEntity({ id: spaceId }, [
      'members',
    ]);

    // space member만 작성 가능
    const isMember = await this.spaceMembersService.isMember(userId, spaceId);

    if (!isMember) {
      throw new Error('멤버만 글을 작성할 수 있습니다.');
    }

    // 공지글인 경우 관리자만 작성 가능
    if (postType === PostType.NOTIFICATION) {
      const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

      if (!isAdmin) {
        throw new Error('관리자만 공지글을 작성할 수 있습니다.');
      }
    }

    // 익명인 경우 참여자만 작성 가능
    if (anonymous) {
      const isParticipate = await this.spaceMembersService.isParticipate(
        userId,
        spaceId,
      );

      if (!isParticipate) {
        throw new Error('참여자만 게시글을 익명으로 작성할 수 있습니다.');
      }
    }

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // postEntity 생성
      await this.createPostEntity(
        {
          title: title,
          content: content,
          anonymous: anonymous,
          postType: postType,
          userId: userId,
          spaceId: spaceId,
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
                spaceId: space.id,
                content: '새로운 게시글입니다.',
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

  async updatePost(
    userId: number,
    spaceId: number,
    postId: number,
    postType: PostType,
    updatePostRequestDto: UpdatePostRequestDto,
  ): Promise<SuccessResponse> {
    const { title, content, anonymous } = updatePostRequestDto;

    // 존재하는 space인지 확인
    const post = await this.getPostEntity({ id: postId }, null);

    // 존재하는 space인지 확인
    const space = await this.spacesService.getSpaceEntity({ id: spaceId }, [
      'members',
    ]);

    // space member만 변경 가능
    const isMember = await this.spaceMembersService.isMember(userId, spaceId);

    if (!isMember) {
      throw new Error('멤버만 글을 작성할 수 있습니다.');
    }

    // 공지글인 경우 관리자만 변경 가능
    if (postType === PostType.NOTIFICATION) {
      const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

      if (!isAdmin) {
        throw new Error('관리자만 공지글을 작성할 수 있습니다.');
      }
    }

    // 익명인 경우 참여자만 변경 가능
    if (anonymous) {
      const isParticipate = await this.spaceMembersService.isParticipate(
        userId,
        spaceId,
      );

      if (!isParticipate) {
        throw new Error('참여자만 게시글을 익명으로 작성할 수 있습니다.');
      }
    }

    const queryRunner = await this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // postEntity 생성
      await this.updatePostEntity(
        post,
        {
          title: title,
          content: content,
          anonymous: anonymous,
          postType: postType,
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
                spaceId: space.id,
                content: '게시글이 수정되었습니다.',
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
   * post 가져오기
   * @param userId
   * @param spaceId
   * @param postId
   */
  async getPost(
    userId: number,
    spaceId: number,
    postId: number,
  ): Promise<PostWithChats> {
    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 존재하는 post인지 확인
    const post = await this.getPostEntity({ id: postId }, [
      'user',
      'chats',
      'chats.replyChats',
      'chats.user',
      'chats.replyChats.user',
    ]);

    // space member만 작성 가능
    const isMember = await this.spaceMembersService.isMember(userId, spaceId);

    if (!isMember) {
      throw new Error('space 멤버만 글을 가져올 수 있습니다.');
    }

    // 관리자 인지 확인
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    if (post.anonymous) {
      post.user = isAdmin || post.userId === userId ? post.user : null;
    }

    post.chats = post.chats.map((chat) => {
      // 익명성 답글들 보여줄지 여부, 익명이면 null 처리
      chat.replyChats = chat.replyChats.map((replyChat) => {
        if (replyChat.anonymous) {
          replyChat.user =
            isAdmin || replyChat.userId === userId ? replyChat.user : null;
        }

        return replyChat;
      });

      // 익명성 댓글들 보여줄지 여부, 익명이면 null 처리
      if (chat.anonymous) {
        chat.user = isAdmin || chat.userId === userId ? chat.user : null;
      }

      return chat;
    });

    return post;
  }

  /**
   * post 삭제
   * @param userId
   * @param spaceId
   * @param postId
   */
  async deletePost(
    userId: number,
    spaceId: number,
    postId: number,
  ): Promise<SuccessResponse> {
    // 존재하는 space인지 확인
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

    // 존재하는 post인지 확인
    const post = await this.getPostEntity({ id: postId }, [
      'chats',
      'chats.replyChats',
      'images',
    ]);

    // 관리자인지 확인
    const isAdmin = await this.spaceMembersService.isAdmin(userId, spaceId);

    // 관리자나 작성자만 삭제 가능
    if (!isAdmin && post.userId !== userId) {
      throw new Error('관리자나 작성자만 글을 삭제할 수 있습니다.');
    }

    // postEntity 삭제
    await this.deletePostEntity(post, null);

    return { success: true };
  }
}
