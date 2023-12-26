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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { AccessTokenGuard } from '../../guards/access.token.guards';
import { CreateSpaceRequestDto } from './request.dto/create.space.request.dto';
import { CreateSpaceResponseDto } from './response.dto/create.space.response.dto';
import { UpdateUserSpaceRoleRequestDto } from './request.dto/update.user.space.role.request.dto';
import { UpdateUserSpaceRoleResponseDto } from './response.dto/update.user.space.role.response.dto';
import { SpaceRolesService } from '../spaceRole/spaceRoles.service';
import { DeleteSpaceResponseDto } from './response.dto/delete.space.response.dto';
import { DeleteSpaceRoleRequestDto } from './request.dto/delete.space.role.request.dto';
import { EntranceSpaceRequestDto } from './request.dto/entrance.space.request.dto';
import { EntranceSpaceResponseDto } from './response.dto/entrance.space.response.dto';
import { GetMySpacesResponseDto } from './response.dto/get.my.spaces.response.dto';
import { CreatePostRequestDto } from './request.dto/create.post.request.dto';
import { PostType } from '../../entities/post.entity';
import { PostsService } from '../posts/posts.service';

@ApiTags('spaces')
@Controller('spaces')
export class SpacesController {
  constructor(
    private spacesService: SpacesService,
    private spaceRolesService: SpaceRolesService,
    private postsService: PostsService,
  ) {}

  @ApiOperation({
    summary: 'space 생성',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/')
  async createSpace(
    @Req() request,
    @Body() createSpaceRequestDto: CreateSpaceRequestDto,
  ): Promise<CreateSpaceResponseDto> {
    const response = await this.spacesService.createSpace(
      parseInt(request.userId),
      createSpaceRequestDto,
    );

    return new CreateSpaceResponseDto(response);
  }

  @ApiOperation({
    summary: '내가 참여하고 있는 space 가져오기',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me')
  async getSpaces(@Req() request): Promise<GetMySpacesResponseDto> {
    const response = await this.spacesService.getSpaces(
      parseInt(request.userId),
    );

    return new GetMySpacesResponseDto(response);
  }

  @ApiOperation({
    summary: 'space 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Delete('/:spaceId')
  async deleteSpace(
    @Req() request,
    @Param('spaceId') spaceId: string,
  ): Promise<DeleteSpaceResponseDto> {
    const response = await this.spacesService.deleteSpace(
      parseInt(request.userId),
      parseInt(spaceId),
    );

    return new DeleteSpaceResponseDto(response);
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
  ): Promise<EntranceSpaceResponseDto> {
    const response = await this.spacesService.entranceSpace(
      parseInt(request.userId),
      parseInt(spaceId),
      entranceSpaceRequestDto,
    );

    return new EntranceSpaceResponseDto(response);
  }

  @ApiOperation({
    summary: 'space roles 삭제',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:spaceId/roles')
  async deleteSpaceRole(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Body() deleteSpaceRoleRequestDto: DeleteSpaceRoleRequestDto,
  ): Promise<UpdateUserSpaceRoleResponseDto> {
    const response = await this.spaceRolesService.deleteSpaceRole(
      parseInt(request.userId),
      parseInt(spaceId),
      deleteSpaceRoleRequestDto,
    );

    return new UpdateUserSpaceRoleResponseDto(response);
  }

  @ApiOperation({
    summary: '유저의 space role 변경',
  })
  @UseGuards(AccessTokenGuard)
  @Patch('/:spaceId/user/:userId/roles')
  async updateUserSpaceRole(
    @Req() request,
    @Param('userId') userId: string,
    @Param('spaceId') spaceId: string,
    @Body() updateUserSpaceRoleRequestDto: UpdateUserSpaceRoleRequestDto,
  ): Promise<UpdateUserSpaceRoleResponseDto> {
    const response = await this.spaceRolesService.updateUserSpaceRole(
      parseInt(request.userId),
      parseInt(userId),
      parseInt(spaceId),
      updateUserSpaceRoleRequestDto,
    );

    return new UpdateUserSpaceRoleResponseDto(response);
  }

  // posts
  @ApiOperation({
    summary: 'post 생성',
  })
  @UseGuards(AccessTokenGuard)
  @Post('/space/:spaceId/post')
  async createPost(
    @Req() request,
    @Param('spaceId') spaceId: string,
    @Query() query,
    @Body() createPostRequestDto: CreatePostRequestDto,
  ) {
    if (
      query.postType !== PostType.NOTIFICATION ||
      query.postType !== PostType.QUESTION
    ) {
      throw new Error('잘못된 쿼리 형식입니다.');
    }

    const response = await this.postsService.createPost(
      parseInt(request.userId),
      parseInt(request.spaceId),
      query.postType,
      createPostRequestDto,
    );
  }
}
