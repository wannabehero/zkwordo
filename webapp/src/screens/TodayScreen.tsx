import { Address, useAccount, useChainId, usePublicClient, useSignTypedData } from 'wagmi';
import Today from '../components/Today';
import Words from '../components/Words';
import { useZkWordoDay, useZkWordoGuess, useZkWordoGuessPrice, zkWordoABI } from '../web3/contracts';
import { useCallback, useEffect, useState } from 'react';
import { ZKWORDO_CONTRACT } from '../web3/const';
import { generateSignedProof } from '../api';
import { ErrorResponse, ProofResponse } from '../api/types';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import useWords from '../hooks/useWords';
import useHint from '../hooks/useHint';
import { useToast } from '@chakra-ui/react';
import { createTypedData } from '../web3/signature';
import { TransactionExecutionError } from 'viem';

const TodayScreen = () => {
  const [proof, setProof] = useState<Address>();
  const addRecentTransaction = useAddRecentTransaction();
  const { data: price } = useZkWordoGuessPrice({
    address: ZKWORDO_CONTRACT,
  });
  const words = useWords();
  const hint = useHint();
  const toast = useToast();
  const [didGuess, setDidGuess] = useState(false);
  const { address } = useAccount();
  const client = usePublicClient();

  const { write: guess, status, data: tx, error, reset } = useZkWordoGuess({
    address: ZKWORDO_CONTRACT,
    value: price ?? BigInt(0),
    args: proof ? [proof] : undefined
  });

  const { data: day } = useZkWordoDay({
    address: ZKWORDO_CONTRACT,
  });

  const chainId = useChainId();

  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    if (!address || typeof day === 'undefined') {
      setDidGuess(false);
      return;
    }
    client.readContract({
      address: ZKWORDO_CONTRACT,
      abi: zkWordoABI,
      functionName: 'balanceOf',
      args: [address, day],
    }).then((balance) => setDidGuess(balance > BigInt(0)));
  }, [address, day, client, setDidGuess]);

  const onGuess = useCallback(async (word: string) => {
    try {
      const signature = await signTypedDataAsync(createTypedData({ word, chainId }));

      const response = await generateSignedProof(word, signature);
      if ('message' in response) {
        throw new Error((response as ErrorResponse).message);
      }

      const { proof } = response as ProofResponse;
      setProof(proof);

      return true;
    } catch (err: any) {
      toast({
        title: 'Proof generation error',
        description: err.message,
        status: 'error',
      });
      return false;
    }
  }, [signTypedDataAsync, setProof, toast, chainId]);

  useEffect(() => {
    if (!proof) {
      return;
    }
    guess();
    setProof(undefined);
  }, [proof, guess]);

  useEffect(() => {
    if (!error) {
      return;
    }
    toast({
      title: 'Contract interaction error',
      description: (error as TransactionExecutionError).details ?? error.message,
      status: 'error',
    });
    reset();
  }, [error, reset, toast]);

  useEffect(() => {
    if (!tx) {
      return;
    }
    addRecentTransaction({
      hash: tx.hash,
      description: 'Guessing'
    });
    // TODO: reload words
    setDidGuess(true);
    toast({
      title: 'Awesome!',
      description: 'You\'ve guessed the today\'s word and has been rewarded with an NFT!',
      status: 'success',
    });
    reset();
  }, [tx, addRecentTransaction, reset, toast]);

  return (
    <>
      <Today
        currency="MATIC"
        didGuess={didGuess}
        day={Number(day ?? 0)}
        hint={hint}
        price={price ?? BigInt(0)}
        onGuess={onGuess}
        isLoading={status === 'loading'}
      />
      <Words
        words={words}
      />
    </>
  );
}

export default TodayScreen;
