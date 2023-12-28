import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../../guards/access.token.guards';

import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('files')
@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @ApiOperation({
    summary: '파일 업로드',
  })
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  saveFile(@Req() request, @UploadedFile() file: Express.Multer.File): string {
    const response = this.filesService.saveFile(file);

    return response;
  }
}
