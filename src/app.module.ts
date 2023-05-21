import { ImageSchema } from './schemas/image.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb://root:password@localhost:27017/database?authSource=admin',
    ),
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
