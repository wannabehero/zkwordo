import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Alert, Button, HStack, Input, Link, Text, VStack } from '@chakra-ui/react';
import { Dayjs } from 'dayjs';
import { useCallback, useState } from 'react';
import { formatEther } from 'viem';
import { useWalletClient } from 'wagmi';

import { getExplorerTokenURL } from '../web3/utils';

interface TodayProps {
  day: number;
  didGuess: boolean;
  hint?: string;
  price: bigint;
  currency: string;
  isLoading?: boolean;
  nextWordAt?: Dayjs;

  onGuess: (word: string) => Promise<boolean>;
}

const Today = ({
  day,
  hint,
  price,
  currency,
  onGuess,
  didGuess,
  isLoading,
  nextWordAt,
}: TodayProps) => {
  const [word, setWord] = useState('');

  const { data: wallet } = useWalletClient();

  const onClick = useCallback(async () => {
    if (await onGuess(word)) {
      setWord('');
    }
  }, [word, onGuess, setWord]);

  return (
    <VStack align="stretch">
      {didGuess && (
        <Alert status="success" variant="solid" borderRadius="md" justifyContent="center">
          <Link href={getExplorerTokenURL(day)} isExternal>
            You&apos;ve guessed today&apos;s word! 🎉
            <ExternalLinkIcon mx="4px" />
          </Link>
        </Alert>
      )}
      {!didGuess && (
        <>
          <Text fontSize="lg">Day #{day}</Text>
          {hint && (
            <Text fontSize="md" color="gray.400">
              Hint: {hint}
            </Text>
          )}
          <HStack>
            <Input
              placeholder="Word..."
              value={word}
              onChange={(e) => setWord(e.target.value.toLowerCase())}
            />
            <Button
              onClick={onClick}
              colorScheme="orange"
              isLoading={isLoading}
              isDisabled={word.length === 0 || wallet === undefined}
            >
              Guess
            </Button>
          </HStack>
          <HStack justifyContent="space-between">
            <Text fontSize="xs" alignSelf="flex-end" color="gray.600">
              Next word at: {nextWordAt?.format('D MMM HH:mm') ?? 'N/A'} UTC
            </Text>
            <Text fontSize="xs" alignSelf="flex-end" color="gray.600">
              Guess price: {formatEther(price)} {currency}
            </Text>
          </HStack>
        </>
      )}
    </VStack>
  );
};

export default Today;
