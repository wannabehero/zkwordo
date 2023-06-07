import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

import { ORDERED_WORDS } from './consts';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';

@Module({
  providers: [
    {
      provide: ORDERED_WORDS,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const contents = fs.readFileSync(config.get('WORDS_PATH'));
        const list = JSON.parse(contents.toString('utf8')) as any[];
        return list.map((item, idx) => ({ ...item, id: idx }));
      },
    },
    WordsService,
  ],
  controllers: [WordsController],
  exports: [WordsService, ORDERED_WORDS],
})
export class WordsModule {}
