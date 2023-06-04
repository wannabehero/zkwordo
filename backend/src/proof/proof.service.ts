import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import * as snarkjs from 'snarkjs';
import { Address, PublicClient, recoverTypedDataAddress } from 'viem';

import { VIEM_CLIENT } from '../web3/consts';
import { WordsService } from '../words/words.service';

@Injectable()
export class ProofService {
  private readonly logger = new Logger(ProofService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly words: WordsService,
    @Inject(VIEM_CLIENT) private readonly viemClient: PublicClient,
  ) {}

  private prepareWord(word: string): number[] {
    const hashed = createHash('sha256').update(word).digest();
    return [...hashed];
  }

  async extractFromSignature(
    word: string,
    signature: Address,
  ): Promise<{ word: string; account: string }> {
    const chainId = await this.viemClient.getChainId();

    const account = await recoverTypedDataAddress({
      signature,
      domain: {
        chainId,
        name: 'ZKWordo',
        version: '1',
        verifyingContract: this.words.zkWordoAddress,
      },
      types: {
        Guess: [{ name: 'word', type: 'string' }],
      },
      primaryType: 'Guess',
      message: {
        word,
      },
    });

    return {
      word,
      account,
    };
  }

  async generateProof(account: string, word: string): Promise<object> {
    const day = await this.words.getCurrentDay();
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
