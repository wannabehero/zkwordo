import { Button, HStack, Input, Text, VStack, } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { formatEther } from 'viem';

interface TodayProps {
  day: number;
  hint: string;
  price: bigint;
  currency: string;
  isLoading?: boolean;

  onGuess: (word: string) => Promise<boolean>;
}

const Today = ({ day, hint, price, currency, onGuess, isLoading }: TodayProps) => {
  const [word, setWord] = useState('');

  const onClick = useCallback(async () => {
    if (await onGuess(word)) {
      setWord('');
    }
  }, [word, onGuess, setWord]);

  return (
    <VStack align="stretch">
      <Text fontSize="lg">Day #{day}</Text>
      <Text fontSize="md" color="gray.400">{hint}</Text>
      <HStack>
        <Input
          placeholder="Word..."
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        <Button
          onClick={onClick}
          colorScheme="orange"
          isLoading={isLoading}
          isDisabled={word.length === 0}
        >
          Guess
        </Button>
      </HStack>
      <Text fontSize="xs" alignSelf="flex-end" color="gray.600">
        Guess price: {formatEther(price)} {currency}
      </Text>
    </VStack>
  );
}

export default Today;
