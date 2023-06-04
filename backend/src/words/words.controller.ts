import { Controller, Get } from '@nestjs/common';
import { WordsService } from './words.service';
import { WordsList } from './types';

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
