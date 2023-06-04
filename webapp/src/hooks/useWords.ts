import { useEffect, useState } from "react";
import { Word } from "../types/word";
import { useAccount, usePublicClient } from "wagmi";
import { ZKWORDO_CONTRACT } from "../web3/const";
import { zkWordoABI } from "../web3/contracts";
import { getOpenedWords } from "../api";

const useWords = () => {
  const [apiWords, setApiWords] = useState<Word[]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const { address } = useAccount();
  const client = usePublicClient();
  const [balances, setBalances] = useState<bigint[]>([]);

  useEffect(() => {
    if (!client || !address || !apiWords.length) {
      return;
    }

    client.readContract({
      address: ZKWORDO_CONTRACT,
      abi: zkWordoABI,
      functionName: 'balanceOfBatch',
      args: [
        new Array(apiWords.length).fill(address),
        [...new Array(apiWords.length).keys()].map((i) => BigInt(i)),
      ]
    }).then((balances) => {
      setBalances([...balances]);
      setWords([]);
    });
  }, [client, address, apiWords, setBalances, setWords]);

  useEffect(() => {
    getOpenedWords()
      .then((words) => {
        setApiWords(words);
      });
  }, [setApiWords]);

  useEffect(() => {
    if ((!balances.length && address) || !apiWords.length) {
      return;
    }
    setWords(apiWords.map((word, idx) => ({
      ...word,
      guessed: address ? balances[idx] > 0 : undefined
    })).reverse());
  }, [balances, setWords, apiWords, address]);

  return words;
}

export default useWords;