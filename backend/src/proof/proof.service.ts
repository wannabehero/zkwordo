import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import * as snarkjs from 'snarkjs';
import { Address, PublicClient, recoverTypedDataAddress } from 'viem';

import { VIEM_CLIENT } from '../web3/consts';
import { ORDERED_WORDS } from '../words/consts';
import { WordsList } from '../words/types';
import { WordsService } from '../words/words.service';
import { MIMC } from './consts';
import { calculateMerkleRootAndPath } from './tree';
import { bufferToBigInt, stringToBigInt } from './utils';

@Injectable()
export class ProofService {
  private readonly logger = new Logger(ProofService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly words: WordsService,
    @Inject(ORDERED_WORDS) private readonly orderedWords: WordsList,
    @Inject(VIEM_CLIENT) private readonly viemClient: PublicClient,
    @Inject(MIMC) private readonly mimc: any,
  ) {}

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

  private preparedWords(): bigint[] {
    return this.orderedWords.map((item) => stringToBigInt(item.word));
  }

  async generateProof(account: string, word: string): Promise<object> {
    const day = await this.words.getCurrentDay();
    this.logger.log(`Generating proof for ${account} on day ${day} with word ${word}`);

    const nullifier = bufferToBigInt(randomBytes(31));

    const words = this.preparedWords();
    const preparedWord = stringToBigInt(word);

    const hashFunc = (left: bigint, right: bigint) =>
      BigInt(this.mimc.F.toString(this.mimc.multiHash([left, right])));

    const hashedWords = words.map((word, idx) => hashFunc(word, BigInt(idx)));
    const hashedWord = hashFunc(preparedWord, day);

    const rootAndPath = await calculateMerkleRootAndPath({
      hashFunc,
      levels: 6,
      elements: hashedWords,
      element: hashedWord,
    });

    const payload = {
      day,
      nullifier,
      root: rootAndPath.root,

      word: preparedWord,
      pathElements: rootAndPath.pathElements,
      pathIndices: rootAndPath.pathIndices,
    };

    const { proof, publicSignals } = await snarkjs.plonk.fullProve(
      payload,
      this.config.get('ZK_WASM_PATH') ?? '../snarks/zkwordo.wasm',
      this.config.get('ZK_ZKEY_PATH') ?? '../snarks/zkwordo_plonk.zkey',
    );
    const calldata: string = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

    const [, ...params] = calldata.match(/^(0x[\w]+),(\[.+\])$/);

    const argv = params[1]
      .replace(/[\"\[\]\s]/g, '')
      .split(',')
      .map((x) => BigInt(x));

    this.logger.log(argv);

    return {
      proof: params[0],
      nullifierHash: argv[0].toString(),
    };
  }
}
