import { Injectable } from '@nestjs/common';
import { ContractMetadata, TokenMetadata } from './types';

@Injectable()
export class MetadataService {
  getContractMetadata(): ContractMetadata {
    return {
      name: 'ZKWordo',
      description: 'ZKWordo is a ZK-SNARKs based word game.',
      image: 'https://api.zkwordo.xyz/api/image/contract',
      external_link: 'https://zkwordo.xyz',
    };
  }

  getTokenMetadata(day: number): TokenMetadata {
    return {
      name: `ZKWordo Day #${day}`,
      description: `Certifies that the holder guessed the word on the day #${day}`,
      image: `https://api.zkwordo.xyz/api/image/day/${day}`,
      properties: {
        day,
      },
      attributes: [
        {
          trait_type: 'Day',
          value: day,
        },
      ],
    };
  }
}
