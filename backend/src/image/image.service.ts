import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { Canvas, CanvasRenderingContext2D, createCanvas, loadImage, registerFont } from 'canvas';

@Injectable()
export class ImageService {
  constructor() {
    registerFont(path.join(__dirname, '../../assets', 'ComicSansMSB.ttf'), {
      family: 'Comic Sans',
    });
  }

  private async loadBaseImage(): Promise<{
    canvas: Canvas;
    ctx: CanvasRenderingContext2D;
  }> {
    const img = await loadImage(path.join(__dirname, '../../assets', 'base.jpg'));
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    return { ctx, canvas };
  }

  async getContractImage(): Promise<Buffer> {
    const { canvas } = await this.loadBaseImage();
    return canvas.toBuffer('image/png');
  }

  async getDayImage(day: number): Promise<Buffer> {
    const { ctx, canvas } = await this.loadBaseImage();

    const text = `Day #${day}`;

    ctx.font = 'bold 30px Comic Sans';
    ctx.fillStyle = '#ffffff';

    const { width } = ctx.measureText(text);
    const x = canvas.width - width - 32;
    const y = canvas.height - 32;
    ctx.fillText(text, x, y);

    return canvas.toBuffer('image/png');
  }
}
