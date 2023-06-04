import { Module } from '@nestjs/common';

import { Web3Module } from '../web3/web3.module';
import { WordsModule } from '../words/words.module';
import { ProofController } from './proof.controller';
import { ProofService } from './proof.service';

@Module({
  imports: [WordsModule, Web3Module],
  providers: [ProofService],
  controllers: [ProofController],
})
export class ProofModule {}
