import { Injectable, Logger } from '@nestjs/common';
import { SaveImageDTO } from './dtos/save-image.dto';
import { DownloadFileUtil } from './utils/download-file.util';
import { SharpUtil } from './utils/sharp.util';

@Injectable()
export class AppService {
  constructor(
    private readonly downloadFileUtil: DownloadFileUtil,
    private readonly sharpUtil: SharpUtil,
  ) {}

  private readonly logger = new Logger(AppService.name);

  async saveImage(saveImageDTO: SaveImageDTO): Promise<string> {
    // download image
    const imagePath = await this.downloadFileUtil.download(saveImageDTO.imgUrl);
    // get original image and resize if width or height is bigger than 720px
    this.sharpUtil.transform(imagePath);
    // compress image according compress param
    // create a copy adding sufix _thumb
    // get image metadata
    // save the original image and your copy file localpath with metadata in mongodb
    return saveImageDTO.imgUrl + String(saveImageDTO.compress);
  }
}
