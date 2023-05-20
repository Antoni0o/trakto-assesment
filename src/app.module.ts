import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { DownloadFileUtil } from './utils/download-file.util';
import { SharpUtil } from './utils/sharp.util';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DownloadFileUtil, SharpUtil],
})
export class AppModule {}
