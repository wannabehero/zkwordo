import { Controller, Get, Header, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly svc: ImageService) {}

  @Get('contract')
  @Header('Content-Type', 'image/png')
  async getContractImage(@Res() res: Response) {
    const img = await this.svc.getContractImage();
    return res.send(img);
  }

  @Get('day/:day')
  @Header('Content-Type', 'image/png')
  async getDayImage(@Param('day') day: string, @Res() res: Response) {
    const img = await this.svc.getDayImage(parseInt(day));
    return res.send(img);
  }
}
