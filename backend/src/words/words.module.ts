import { ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as fs from 'fs';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { ORDERED_WORDS } from './consts';

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
  exports: [WordsService],
})
export class WordsModule {}
