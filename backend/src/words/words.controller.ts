import { Controller, Get } from '@nestjs/common';

import { WordsList } from './types';
import { WordsService } from './words.service';

@Controller('words')
export class WordsController {
  constructor(private readonly svc: WordsService) {}

  @Get('/opened')
  async getOpenedWords(): Promise<WordsList> {
    return this.svc.getOpenedWords();
  }

  @Get('/hint')
  async getTodayHint(): Promise<{ hint: string }> {
    return {
      hint: await this.svc.getTodayHint(),
    };
  }
}
