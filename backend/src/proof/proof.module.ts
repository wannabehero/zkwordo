import { Module } from '@nestjs/common';
import { buildMimcSponge } from 'circomlibjs';

import { Web3Module } from '../web3/web3.module';
import { WordsModule } from '../words/words.module';
import { MIMC } from './consts';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';

@Module({
  imports: [WordsModule, Web3Module],
  providers: [
    {
      provide: MIMC,
      useFactory: async () => buildMimcSponge(),
    },
    ProofService,
  ],
  controllers: [ProofController],
})
export class ProofModule {}
