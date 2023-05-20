import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { basename, join } from 'path';

@Injectable()
export class DownloadFileUtil {
  private readonly logger = new Logger(DownloadFileUtil.name);

  async download(imgUrl: string): Promise<string> {
    this.logger.log(`Starting download, file: ${imgUrl}`);

    const fileName = basename(imgUrl, 'jpeg');
    const path = join(__dirname, '..', `original/${fileName}jpeg`);

    if (!existsSync(path)) {
      mkdirSync(join(__dirname, '..', 'original'), { recursive: true });
    }

    try {
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
        });
      });
    } catch (err) {
      this.logger.log(`Download Failed: ${err.message}`);
      throw err;
    }

    return path;
  }
}
