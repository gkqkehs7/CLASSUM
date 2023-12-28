import { Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  /**
   * 파일 업로드
   * @param file
   */
  saveFile(file: Express.Multer.File): string {
    return file.path;
  }
}
