import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AccessTokenGuard } from '../../guards/access.token.guards';
import { PostType } from '../../entities/post.entity';
import { SpacesService } from './spaces.service';
import { SpaceRolesService } from '../space.roles/space.roles.service';
import { ChatsService } from '../chat/chats.service';
import { PostsService } from '../posts/posts.service';
import { ReplyChatsService } from '../reply.chats/reply.chats.service';
import { CreateSpaceRequestDto } from './request.dto/create.space.request.dto';
import { CreatePostRequestDto } from './request.dto/create.post.request.dto';
import { CreateChatRequestDto } from './request.dto/create.chat.request.dto';
import { CreateReplyChatRequestDto } from './request.dto/create.reply.chat.request.dto';
import { UpdatePostRequestDto } from './request.dto/update.post.request.dto';
import { UpdateUserSpaceRoleRequestDto } from './request.dto/update.user.space.role.request.dto';
import { DeleteSpaceRoleRequestDto } from './request.dto/delete.space.role.request.dto';
import { EntranceSpaceRequestDto } from './request.dto/entrance.space.request.dto';
import { GetPostResponseDto } from './response.dto/get.post.response.dto';
import { SuccessResponseDto } from '../dto/success.response.dto';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private spacesService: SpacesService,
    private spaceRolesService: SpaceRolesService,
    private postsService: PostsService,
    private chatsService: ChatsService,
    private replyChatsService: ReplyChatsService,
  ) {}

  @ApiOperation({
    summary: 'space 생성',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createSpace(
    @Req() request,
    @Body() createSpaceRequestDto: CreateSpaceRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.spacesService.createSpace(
      parseInt(request.userId),
      createSpaceRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'space 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:spaceId')
  async deleteSpace(
    @Req() request,
    @Param('spaceId') spaceId: string,
  ): Promise<SuccessResponseDto> {
    const response = await this.spacesService.deleteSpace(
      parseInt(request.userId),
      parseInt(spaceId),
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'space 참여',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:spaceId/entrance')
  async entranceSpace(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Body() entranceSpaceRequestDto: EntranceSpaceRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.spacesService.entranceSpace(
      parseInt(request.userId),
      parseInt(spaceId),
      entranceSpaceRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  // spaceRoles
  @ApiOperation({
    summary: 'space roles 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:spaceId/roles')
  async deleteSpaceRole(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Body() deleteSpaceRoleRequestDto: DeleteSpaceRoleRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.spaceRolesService.deleteSpaceRole(
      parseInt(request.userId),
      parseInt(spaceId),
      deleteSpaceRoleRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: '유저의 space role 변경',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:spaceId/members/:memberId/roles')
  async updateUserSpaceRole(
    @Req() request,
    @Param('memberId') memberId: string,
    @Param('spaceId') spaceId: string,
    @Body() updateUserSpaceRoleRequestDto: UpdateUserSpaceRoleRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.spaceRolesService.updateUserSpaceRole(
      parseInt(request.userId),
      parseInt(memberId),
      parseInt(spaceId),
      updateUserSpaceRoleRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  // posts
  @ApiOperation({
    summary: 'post 생성',
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:spaceId/post')
  async createPost(
    @Req() request,
    @Query() query,
    @Param('spaceId') spaceId: string,
    @Body() createPostRequestDto: CreatePostRequestDto,
  ): Promise<SuccessResponseDto> {
    if (
      query.postType !== PostType.NOTIFICATION &&
      query.postType !== PostType.QUESTION
    ) {
      throw new Error('잘못된 쿼리 형식입니다.');
    }

    const response = await this.postsService.createPost(
      parseInt(request.userId),
      parseInt(spaceId),
      query.postType,
      createPostRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'post 업데이트',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:spaceId/post/:postId')
  async updatePost(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
    @Query() query,
    @Body() updatePostRequestDto: UpdatePostRequestDto,
  ): Promise<SuccessResponseDto> {
    if (
      query.postType !== PostType.NOTIFICATION &&
      query.postType !== PostType.QUESTION
    ) {
      throw new Error('잘못된 쿼리 형식입니다.');
    }

    const response = await this.postsService.updatePost(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
      query.postType,
      updatePostRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'post 가져오기',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:spaceId/posts/:postId')
  async getPost(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
  ) {
    const response = await this.postsService.getPost(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
    );

    return new GetPostResponseDto(response);
  }

  @ApiOperation({
    summary: 'post 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:spaceId/posts/:postId')
  async deletePost(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
  ): Promise<SuccessResponseDto> {
    const response = await this.postsService.deletePost(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
    );

    return new SuccessResponseDto(response);
  }

  // chats
  @ApiOperation({
    summary: 'chat 생성',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:spaceId/posts/:postId/chats')
  async createChat(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
    @Body() createChatRequestDto: CreateChatRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.chatsService.createChat(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
      createChatRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'chat 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:spaceId/posts/:postId/chats/:chatId')
  async deleteChat(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
    @Param('chatId') chatId: string,
  ): Promise<SuccessResponseDto> {
    const response = await this.chatsService.deleteChat(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
      parseInt(chatId),
    );

    return new SuccessResponseDto(response);
  }

  // replyChats
  @ApiOperation({
    summary: 'replyChat 생성',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/:spaceId/posts/:postId/chats/:chatId/replyChats')
  async createReplyChat(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
    @Param('chatId') chatId: string,
    @Body() createReplyChatRequestDto: CreateReplyChatRequestDto,
  ): Promise<SuccessResponseDto> {
    const response = await this.replyChatsService.createReplyChat(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
      parseInt(chatId),
      createReplyChatRequestDto,
    );

    return new SuccessResponseDto(response);
  }

  @ApiOperation({
    summary: 'replyChat 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:spaceId/posts/:postId/chats/:chatId/replyChats/:replyChatId')
  async deleteReplyChat(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Param('postId') postId: string,
    @Param('chatId') chatId: string,
    @Param('replyChatId') replyChatId: string,
  ): Promise<SuccessResponseDto> {
    const response = await this.replyChatsService.deleteReplyChat(
      parseInt(request.userId),
      parseInt(spaceId),
      parseInt(postId),
      parseInt(chatId),
      parseInt(replyChatId),
    );

    return new SuccessResponseDto(response);
  }
}
