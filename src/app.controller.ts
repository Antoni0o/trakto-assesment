import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SaveImageDTO } from './dtos/save-image.dto';

@Controller('image')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('save')
  @UseInterceptors(FileInterceptor('img'))
  saveImage(@Body() saveImageDTO: SaveImageDTO) {
    this.appService.saveImage(saveImageDTO);
  }
}
