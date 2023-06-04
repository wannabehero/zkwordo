import { ZKWORDO_CONTRACT } from './const';

export function createTypedData({
  chainId,
  word,
}: {
  chainId: number;
  word: string;
}) {
  return {
    domain: {
      chainId,
      name: 'ZKWordo',
      version: '1',
      verifyingContract: ZKWORDO_CONTRACT,
    },
    types: {
      Guess: [
        { name: 'word', type: 'string' }
      ],
    },
    primaryType: 'Guess',
    message: {
      word
    }
  } as const;
}