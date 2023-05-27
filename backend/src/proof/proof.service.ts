import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as snarkjs from 'snarkjs';

@Injectable()
export class ProofService {
  private readonly logger = new Logger(ProofService.name);

  constructor(private readonly config: ConfigService) {}

  private prepareWord(word: string): number[] {
    const hashed = createHash('sha256').update(word).digest();
    return [...hashed];
  }

  async generateProof(account: string, word: string, day: number): Promise<object> {
    this.logger.log(`Generating proof for ${account} on day ${day} with word ${word}`);

    const guess = this.prepareWord(word);
    this.logger.debug(`Guess: ${guess}`);

    const payload = {
      day,
      guess,
      addressIn: BigInt(account).toString(),
    };

    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      payload,
      this.config.get('ZK_WASM_PATH') ?? '../snarks/words.wasm',
      this.config.get('ZK_ZKEY_PATH') ?? '../snarks/words_plonk.zkey',
    );

    const calldata: string = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

    const [, ...params] = calldata.match(/^(0x[\w]+),(\[.+\])$/);

    return {
      proof: params[0],
    };
  }
}
