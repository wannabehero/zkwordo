import { Module } from '@nestjs/common';
import { ProofService } from './proof.service';
import { ProofController } from './proof.controller';
import { WordsModule } from '../words/words.module';
import { Web3Module } from '../web3/web3.module';

@Module({
  imports: [WordsModule, Web3Module],
  providers: [ProofService],
  controllers: [ProofController],
})
export class ProofModule {}
