import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  saveFile(file: Express.Multer.File): string {
    return file.path;
  }
}
