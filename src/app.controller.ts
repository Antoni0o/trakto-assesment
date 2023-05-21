import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SaveImageDTO } from './dtos/save-image.dto';
import { Image } from './interfaces/image.interface';

@Controller('image')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('save')
  saveImage(@Body() saveImageDTO: SaveImageDTO): Promise<Image> {
    return this.appService.execute(saveImageDTO);
  }
}
