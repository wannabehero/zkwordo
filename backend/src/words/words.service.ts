import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Address, PublicClient } from 'viem';

import { VIEM_CLIENT } from '../web3/consts';
import { zkWordoABI } from '../web3/contracts';
import { ORDERED_WORDS } from './consts';
import { WordsList } from './types';

@Injectable()
export class WordsService {
  readonly zkWordoAddress: Address;

  constructor(
    @Inject(VIEM_CLIENT) private readonly viemClient: PublicClient,
    @Inject(ORDERED_WORDS) private readonly wordsList: WordsList,
    config: ConfigService,
  ) {
    this.zkWordoAddress = config.get('ZK_WORDO_ADDRESS');
  }

  async getCurrentDay(): Promise<bigint> {
    return this.viemClient.readContract({
      address: this.zkWordoAddress,
      abi: zkWordoABI,
      functionName: 'day',
    });
  }

  async getOpenedWords(): Promise<WordsList> {
    const currentDay = await this.getCurrentDay();
    return this.wordsList.slice(0, Number(currentDay));
  }

  async getTodayHint(): Promise<string> {
    const currentDay = await this.getCurrentDay();
    return this.wordsList[Number(currentDay)].hint;
  }
}
