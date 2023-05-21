import { SaveImageDTO } from './dtos/save-image.dto';
import { Image } from './interfaces/image.interface';
import { AppError } from './errors/app.error';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { basename, extname, join } from 'path';
import { load, Tags } from 'exifreader';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as sharp from 'sharp';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    @InjectModel('Image')
    private imageModel: Model<Image>,
  ) {}
  private readonly logger = new Logger(AppService.name);

  async execute(saveImageDTO: SaveImageDTO): Promise<Image> {
    const originalImagePath = await this.downloadImage(saveImageDTO.imgUrl);

    const thumbImagePath = await this.transform(
      originalImagePath,
      saveImageDTO.compress,
    );

    const exif = await this.getExif(originalImagePath);

    const data = await this.saveData(originalImagePath, thumbImagePath, exif);

    return data;
  }

  async downloadImage(imgUrl: string): Promise<string> {
    this.logger.log(`Starting download, file: [${imgUrl}]`);

    const extension = extname(imgUrl);

    if (extension != '.jpg' && extension != '.jpeg') {
      throw new AppError(
        'Invalid file extension, only jpg and jpeg are allowed!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const fileName = basename(imgUrl, extension);
    const path = join(`original`, `${fileName}.jpg`);

    if (!existsSync(path)) {
      mkdirSync(join('original'), { recursive: true });
    }

    this.logger.log(`Downloading file: [${imgUrl}] to [${path}]`);

    const res = await axios({
      url: imgUrl,
      method: 'GET',
      responseType: 'stream',
    });

    res.data.pipe(createWriteStream(path));

    return new Promise((resolve, reject) => {
      res.data.on('end', () => {
        this.logger.log('Download Completed Successfully!');
        resolve(path);
      });

      res.data.on('error', (err) => {
        reject(err);
        this.logger.error('Error While Downloading!');
        throw new AppError(
          'Error While Downloading!',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      });
    });
  }

  async transform(imagePath: string, compress: number): Promise<string> {
    this.logger.log(`Starting to transform image: [${imagePath}]`);
    const image = readFileSync(imagePath);
    const { width, height } = await sharp(image.buffer).metadata();

    const originalName = basename(imagePath, '.jpg');
    const filename = originalName + '_thumb' + '.jpg';
    const finalPath = join('thumb', filename);

    if (!existsSync(join('thumb'))) {
      mkdirSync(join('thumb'), { recursive: true });
    }

    if (height > 720 && height > width) {
      await sharp(image.buffer)
        .resize({ height: 720 })
        .jpeg({ quality: this.handleCompressValue(compress) })
        .toFile(finalPath);
      this.logger.log(`Image transformed successfully: [${finalPath}]`);
    } else if (width > 720 && width > height) {
      await sharp(image.buffer)
        .resize({ width: 720 })
        .jpeg({ quality: this.handleCompressValue(compress) })
        .toFile(finalPath);
      this.logger.log(`Image transformed successfully: [${finalPath}]`);
    } else {
      await sharp(image.buffer)
        .jpeg({ quality: this.handleCompressValue(compress) })
        .toFile(finalPath);
      this.logger.log(`Image transformed successfully: [${finalPath}]`);
    }

    return finalPath;
  }

  async getExif(imagePath: string): Promise<Tags> {
    this.logger.log(`Starting to get exif data of: [${imagePath}]`);
    const image = readFileSync(imagePath);
    const metadata = load(image);

    this.logger.log(`Exif data of: [${imagePath}] obtained successfully!`);
    return metadata;
  }

  async saveData(
    originalImagePath: string,
    thumbImagePath: string,
    exif: Tags,
  ) {
    this.logger.log(`Starting to save Image data`);
    try {
      const data = await new this.imageModel({
        localpath: {
          original: originalImagePath,
          thumb: thumbImagePath,
        },
        metadata: [exif],
      }).save();

      this.logger.log(`Image data saved successfully!`);
      return data;
    } catch (err) {
      this.logger.error(err);
      if (err instanceof mongoose.Error) {
        throw new AppError(
          `Query Error: [${err.message}]`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new AppError(
        'Unknown server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  handleCompressValue(compress: number) {
    if (compress > 1 && compress < 0.1) {
      throw new AppError(
        'Compress value must be between 0.1 and 1',
        HttpStatus.BAD_REQUEST,
      );
    }

    return compress * 100;
  }
}
