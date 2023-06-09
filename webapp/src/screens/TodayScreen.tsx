import { Alert, Stack, useToast } from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { TransactionExecutionError } from 'viem';
import { useAccount, useChainId, usePublicClient, useSignTypedData } from 'wagmi';
import { WriteContractResult } from 'wagmi/actions';

import { generateSignedProof } from '../api';
import { ProofResponse } from '../api/types';
import Intro from '../components/Intro';
import Today from '../components/Today';
import Words from '../components/Words';
import useHint from '../hooks/useHint';
import useWords from '../hooks/useWords';
import { ZKWORDO_CONTRACT } from '../web3/const';
import {
  useZkWordoDay,
  useZkWordoGuess,
  useZkWordoGuessPrice,
  useZkWordoMaxWords,
  useZkWordoNextWordAt,
  zkWordoABI,
} from '../web3/contracts';
import { createTypedData } from '../web3/signature';

const TodayScreen = () => {
  const [proofResponse, setProofResponse] = useState<ProofResponse>();
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
  const [isLoadingProof, setIsLoadingProof] = useState(false);
  const [isLoadingResult, setIsLoadingResult] = useState(false);
  const [txInProgress, setTxInProgress] = useState<WriteContractResult>();

  const {
    writeAsync: guess,
    status,
    error,
    reset,
  } = useZkWordoGuess({
    address: ZKWORDO_CONTRACT,
    value: price ?? BigInt(0),
    args: proofResponse ? [BigInt(proofResponse.nullifierHash), proofResponse.proof] : undefined,
  });

  const { data: day } = useZkWordoDay({
    address: ZKWORDO_CONTRACT,
  });
  const { data: maxWords } = useZkWordoMaxWords({
    address: ZKWORDO_CONTRACT,
  });
  const { data: nextWordAtTs } = useZkWordoNextWordAt({
    address: ZKWORDO_CONTRACT,
  });

  const chainId = useChainId();

  const { signTypedDataAsync } = useSignTypedData();

  useEffect(() => {
    if (!address || typeof day === 'undefined') {
      setDidGuess(false);
      return;
    }
    client
      .readContract({
        address: ZKWORDO_CONTRACT,
        abi: zkWordoABI,
        functionName: 'balanceOf',
        args: [address, day],
      })
      .then((balance) => setDidGuess(balance > BigInt(0)));
  }, [address, day, client, setDidGuess]);

  const onGuess = useCallback(
    async (word: string) => {
      setIsLoadingProof(true);
      try {
        const signature = await signTypedDataAsync(createTypedData({ word, chainId }));

        const response = await generateSignedProof(word, signature);
        if ('message' in response) {
          throw new Error(response.message);
        }

        setProofResponse(response);

        return true;
      } catch (err: any) {
        toast({
          title: 'Proof generation error',
          description: err.message,
          status: 'error',
        });
        return false;
      } finally {
        setIsLoadingProof(false);
      }
    },
    [signTypedDataAsync, setProofResponse, setIsLoadingProof, toast, chainId],
  );

  useEffect(() => {
    if (!proofResponse) {
      return;
    }
    guess().then(setTxInProgress);
    setProofResponse(undefined);
  }, [proofResponse, setProofResponse, guess]);

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
    if (!txInProgress) {
      return;
    }
    setIsLoadingResult(true);
    addRecentTransaction({
      hash: txInProgress.hash,
      description: 'Guessing',
    });
    client.waitForTransactionReceipt({ hash: txInProgress.hash, confirmations: 2 }).then(() => {
      setTxInProgress(undefined);
      setIsLoadingResult(false);
      setDidGuess(true);
      toast({
        title: 'Awesome!',
        description: "You've guessed the today's word and has been rewarded!",
        status: 'success',
      });
      reset();
    });
  }, [
    txInProgress,
    addRecentTransaction,
    setIsLoadingResult,
    setTxInProgress,
    setDidGuess,
    reset,
    toast,
    client,
  ]);

  return (
    <Stack spacing={4}>
      <Intro />
      {day && maxWords && day === maxWords ? (
        <Alert status="info" borderRadius="md">
          No more words left to guess this season. Please wait for the next season to start.
        </Alert>
      ) : (
        <Today
          currency="MATIC"
          didGuess={didGuess}
          day={Number(day ?? 0)}
          hint={hint}
          price={price ?? BigInt(0)}
          onGuess={onGuess}
          isLoading={status === 'loading' || isLoadingProof || isLoadingResult}
          nextWordAt={nextWordAtTs ? dayjs.utc(Number(nextWordAtTs) * 1000) : undefined}
        />
      )}
      <Words words={words} />
    </Stack>
  );
};

export default TodayScreen;
