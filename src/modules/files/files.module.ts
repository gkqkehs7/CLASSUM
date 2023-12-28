import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterConfigService } from '../../config/multer.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
