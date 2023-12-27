import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceEntity } from '../../entities/space.entity';
import { QueryRunner, Repository } from 'typeorm';
import { SpaceRoleEntity } from '../../entities/spaceRole.entity';
import { SpaceMemberEntity } from '../../entities/spaceMember.entity';
import { PostEntity, PostType } from '../../entities/post.entity';
import { CreatePostRequestDto } from '../spaces/request.dto/create.post.request.dto';
import { SuccessResponse } from '../../types/common.types';
import { CreatePostDAO, PostWithChats } from '../../types/posts.types';
import { SpacesService } from '../spaces/spaces.service';
import { SpaceMembersService } from '../space.member/space.members.service';

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
    @Inject(forwardRef(() => SpacesService))
    private readonly spacesService: SpacesService,
    private readonly spaceMembersService: SpaceMembersService,
  ) {}

  /**
   * postEntity 생성
   * @param createPostDAO
   * @param queryRunner
   */
  async createPostEntity(
    createPostDAO: CreatePostDAO,
    queryRunner: QueryRunner,
  ): Promise<PostEntity> {
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
  ): Promise<PostEntity> {
    const post = await this.postRepository.findOne({
      where: where,
      relations: relations,
    });

    if (!post) {
      throw new Error('존재하지 않는 post 입니다.');
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
    await this.spacesService.getSpaceEntity({ id: spaceId }, null);

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
      null,
    );

    return { success: true };
  }

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
      throw new Error('멤버만 글을 가져올 수 있습니다.');
    }

    // const role = spaceMember.roleType;
    //
    // if (post.anonymous) {
    //   post.user =
    //     role === SpaceRoleType.ADMIN || post.userId === userId
    //       ? post.user
    //       : null;
    // }
    //
    // post.chats = post.chats.map((chat) => {
    //   chat.replyChats = chat.replyChats.map((replyChat) => {
    //     if (replyChat.anonymous) {
    //       replyChat.user =
    //         role === SpaceRoleType.ADMIN && replyChat.userId === userId
    //           ? replyChat.user
    //           : null;
    //     }
    //
    //     return replyChat;
    //   });
    //
    //   if (chat.anonymous) {
    //     chat.user =
    //       role === SpaceRoleType.ADMIN && chat.userId === userId
    //         ? chat.user
    //         : null;
    //   }
    //
    //   return chat;
    // });

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
      'chat.replyChats',
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
