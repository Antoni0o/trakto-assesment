import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Image } from './interfaces/image.interface';
import { SaveImageDTO } from './dtos/save-image.dto';
import { Test, TestingModule } from '@nestjs/testing';

const image: Image = {
  localpath: {
    original: 'original',
    thumb: 'thumb',
  },
  metadata: {},
};

const imageDto: SaveImageDTO = {
  imgUrl: 'imgUrl',
  compress: 0.1,
};

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            execute: () => jest.fn(),
          },
        },
      ],
    }).compile();

    controller = app.get<AppController>(AppController);
    service = app.get<AppService>(AppService);
  });

  describe('App Controller', () => {
    it('should return Image data', async () => {
      jest.spyOn(service, 'execute').mockResolvedValue(image);

      const result = await controller.saveImage(imageDto);

      expect(result).toBe(image);
      expect(service.execute).toHaveBeenCalled();
    });
  });
});
