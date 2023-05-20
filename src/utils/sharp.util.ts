import { Injectable } from '@nestjs/common';
import { readFile, existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';
import * as probe from 'probe-image-size';
import * as sharp from 'sharp';

@Injectable()
export class SharpUtil {
  async transform(imagePath: string): Promise<string> {
    let image: Buffer;

    readFile(imagePath, (err, data) => {
      if (err) throw err;
      image = data;
    });

    const originalName = basename(imagePath, 'jpeg');
    const filename = originalName.slice(0, -1) + '_thumb' + '.jpeg';
    const finalPath = join('thumb', filename);

    if (!existsSync(join(__dirname, '..', 'thumb'))) {
      mkdirSync(join(__dirname, '..', 'thumb'), { recursive: true });
    }

    const resolution = await probe(imagePath);

    if (resolution.height > 720) {
      await sharp(image.buffer)
        .resize({ height: 720 })
        .jpeg()
        .toFile(finalPath);
    } else if (resolution.width > 720) {
      await sharp(image.buffer).resize({ width: 720 }).jpeg().toFile(finalPath);
    } else {
      await sharp(image.buffer).jpeg().toFile(finalPath);
    }

    return filename;
  }
}
