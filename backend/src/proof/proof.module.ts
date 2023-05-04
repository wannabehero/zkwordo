import * as fs from 'fs';
import { Module } from '@nestjs/common';
import { initialize } from 'zokrates-js';
import { ProofService } from './proof.service';
import { ProofController } from './proof.controller';
import { ARTIFACTS, PROVIDER } from './consts';

@Module({
  providers: [
    {
      provide: ARTIFACTS,
      useFactory: () => {
        const contents = JSON.parse(fs.readFileSync('../artifacts/zk/program.json', 'utf8'));
        return {
          ...contents,
          program: Uint8Array.from(contents.program),
        };
      },
    },
    {
      provide: PROVIDER,
      useFactory: async () => initialize(),
    },
    ProofService,
  ],
  controllers: [ProofController],
})
export class ProofModule {}
