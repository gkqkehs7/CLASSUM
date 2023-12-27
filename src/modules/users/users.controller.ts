import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../guards/access.token.guards';
import { UsersService } from './users.service';
import { GetMyInfoResponseDto } from './dto/get.my.info.response.dto';
import { GetUserInfoResponseDto } from './dto/get.user.info.response.dto';
import { GetMySpacesResponseDto } from './dto/get.my.spaces.response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({
    summary: '자신 프로필 조회',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me/profile')
  async getMyInfo(@Req() request): Promise<GetMyInfoResponseDto> {
    const response = await this.usersService.getMyInfo(request.userId);

    return new GetMyInfoResponseDto(response);
  }

  @ApiOperation({
    summary: '다른사람 프로필 조회',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/:userId/profile')
  async getUserInfo(
    @Req() request,
    @Param('userId') userId: string,
  ): Promise<GetUserInfoResponseDto> {
    const response = await this.usersService.getUserInfo(
      request.userId,
      parseInt(userId),
    );

    return new GetUserInfoResponseDto(response);
  }

  @ApiOperation({
    summary: '나의 공간들 가져오기',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me/spaces')
  async getMySpaces(@Req() request): Promise<GetMySpacesResponseDto> {
    const response = await this.usersService.getMySpaces(request.userId);

    return new GetMySpacesResponseDto(response);
  }

  @ApiOperation({
    summary: '내가 작성한 게시글들 가져오기',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me/posts')
  async getMyPosts(@Req() request) {
    const response = await this.usersService.getMyPosts(request.userId);
  }

  @ApiOperation({
    summary: '내가 작성한 댓글들 가져오기',
  })
  @UseGuards(AccessTokenGuard)
  @Get('/me/chats')
  async getMyChats(@Req() request) {
    const response = await this.usersService.getMyChats(request.userId);
  }
}
