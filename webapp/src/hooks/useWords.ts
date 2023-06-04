import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

import { getOpenedWords } from '../api';
import { Word } from '../types/word';
import { ZKWORDO_CONTRACT } from '../web3/const';
import { zkWordoABI } from '../web3/contracts';

const useWords = () => {
  const [apiWords, setApiWords] = useState<Word[]>([]);
  const [words, setWords] = useState<Word[]>();
  const { address } = useAccount();
  const client = usePublicClient();
  const [balances, setBalances] = useState<bigint[]>([]);

  useEffect(() => {
    if (!client || !address || !apiWords.length) {
      return;
    }

    client
      .readContract({
        address: ZKWORDO_CONTRACT,
        abi: zkWordoABI,
        functionName: 'balanceOfBatch',
        args: [
          new Array(apiWords.length).fill(address),
          [...new Array(apiWords.length).keys()].map((i) => BigInt(i)),
        ],
      })
      .then((results) => {
        setBalances([...results]);
        setWords([]);
      });
  }, [client, address, apiWords, setBalances, setWords]);

  useEffect(() => {
    getOpenedWords().then(setApiWords);
  }, [setApiWords]);

  useEffect(() => {
    setWords(
      apiWords
        .map((word, idx) => ({
          ...word,
          guessed: address ? balances[idx] > 0 : undefined,
        }))
        .reverse(),
    );
  }, [balances, setWords, apiWords, address]);

  return words;
};

export default useWords;
