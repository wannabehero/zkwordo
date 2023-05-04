import { Inject, Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import { CompilationArtifacts, ZoKratesProvider } from 'zokrates-js';
import { ARTIFACTS, PROVIDER } from './consts';

@Injectable()
export class ProofService {
  private readonly privateKey: Uint8Array;
  private readonly logger = new Logger(ProofService.name);

  constructor(
    @Inject(ARTIFACTS) private readonly artifacts: CompilationArtifacts,
    @Inject(PROVIDER) private readonly provider: ZoKratesProvider,
  ) {
    this.privateKey = this.provider.setup(this.artifacts.program).pk;
  }

  private prepareWord(word: string): string[] {
    const hashed = createHash('sha256').update(word).digest();
    return [...hashed].map((n) => n.toString());
  }

  async generateProof(account: string, word: string, day: number): Promise<object> {
    this.logger.log(`Generating proof for ${account} on day ${day} with word ${word}`);

    const { witness } = this.provider.computeWitness(this.artifacts, [
      this.prepareWord(word),
      day.toString(),
      BigInt(account).toString(),
    ]);

    const { proof } = this.provider.generateProof(this.artifacts.program, witness, this.privateKey);
    return proof;
  }
}
