import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  Box,
  Highlight,
  Link,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useCallback, useEffect, useState } from 'react';
import { TransactionExecutionError } from 'viem';
import { Address, useAccount, useChainId, usePublicClient, useSignTypedData } from 'wagmi';

import { generateSignedProof } from '../api';
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
  zkWordoABI,
} from '../web3/contracts';
import { createTypedData } from '../web3/signature';

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

  const {
    write: guess,
    status,
    data: tx,
    error,
    reset,
  } = useZkWordoGuess({
    address: ZKWORDO_CONTRACT,
    value: price ?? BigInt(0),
    args: proof ? [proof] : undefined,
  });

  const { data: day } = useZkWordoDay({
    address: ZKWORDO_CONTRACT,
  });
  const { data: maxWords } = useZkWordoMaxWords({
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
      try {
        const signature = await signTypedDataAsync(createTypedData({ word, chainId }));

        const response = await generateSignedProof(word, signature);
        if ('message' in response) {
          throw new Error(response.message);
        }

        setProof(response.proof);

        return true;
      } catch (err: any) {
        toast({
          title: 'Proof generation error',
          description: err.message,
          status: 'error',
        });
        return false;
      }
    },
    [signTypedDataAsync, setProof, toast, chainId],
  );

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
      description: 'Guessing',
    });
    setDidGuess(true);
    toast({
      title: 'Awesome!',
      description: "You've guessed the today's word and has been rewarded!",
      status: 'success',
    });
    reset();
  }, [tx, addRecentTransaction, reset, toast]);

  return (
    <Stack spacing={4}>
      <Stack spacing={4}>
        <Text fontSize="lg">ZKWordo — is a ZKP-based word guessing game.</Text>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  How it works?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Stack spacing={2}>
                <Text>
                  <Highlight query="guess the word" styles={{ px: '1', py: '1', bg: 'teal.300' }}>
                    Every day there&apos;s a new word to guess. There&apos;s also a hint to help you
                    guess the word. Words are primarily aroung the crypto and web3 ecosystem.
                  </Highlight>
                </Text>
                <Text>
                  <Highlight query="sign a message" styles={{ px: '1', py: '1', bg: 'orange.300' }}>
                    To submit a guess, you need to sign a message with your wallet. This is required
                    to prove that you&apos;re the one who guessed the word.
                  </Highlight>
                </Text>
                <Text>
                  <Highlight
                    query={['ZK proof', 'submit']}
                    styles={{ px: '1', py: '1', bg: 'red.300' }}
                  >
                    If the word is guessed correctly the ZK proof will be generated that you submit
                    to the smart contract.
                  </Highlight>
                </Text>
                <Text>
                  <Highlight
                    query="rewarded with an NFT"
                    styles={{ px: '1', py: '1', bg: 'green.300' }}
                  >
                    If the proof is valid, you&apos;ll be rewarded with an NFT, proving that you
                    guessed the word.
                  </Highlight>
                </Text>
                <Text>
                  There&apos;s a <b>symbolic</b> payment required to submit a guess.
                </Text>
                <Text>
                  The project source code is fully{' '}
                  <Link href="https://github.com/wannabehero/zkwordo">
                    open-sourced.
                    <ExternalLinkIcon mx="4px" />
                  </Link>
                </Text>
              </Stack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Stack>
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
          isLoading={status === 'loading'}
        />
      )}
      <Words words={words} />
    </Stack>
  );
};

export default TodayScreen;
