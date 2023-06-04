import { Alert, Button, HStack, Input, Text, VStack, } from '@chakra-ui/react';
import { useCallback, useState } from 'react';
import { formatEther } from 'viem';

interface TodayProps {
  day: number;
  didGuess: boolean;
  hint?: string;
  price: bigint;
  currency: string;
  isLoading?: boolean;

  onGuess: (word: string) => Promise<boolean>;
}

const Today = ({ day, hint, price, currency, onGuess, didGuess, isLoading }: TodayProps) => {
  const [word, setWord] = useState('');

  const onClick = useCallback(async () => {
    if (await onGuess(word)) {
      setWord('');
    }
  }, [word, onGuess, setWord]);

  return (
    <VStack align="stretch">
      {
        didGuess && (
          <Alert status='success' variant='solid' borderRadius='md' justifyContent='center'>
            You've guessed today's word! 🎉
            <br/># TODO: add link to NFT
          </Alert>
        )
      }
      {
        !didGuess && (
          <>
            <Text fontSize="lg">Day #{day}</Text>
            {
              hint && (
                <Text fontSize="md" color="gray.400">Hint: {hint}</Text>
              )
            }
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
                isDisabled={word.length === 0}
              >
                Guess
              </Button>
            </HStack>
            <Text fontSize="xs" alignSelf="flex-end" color="gray.600">
              Guess price: {formatEther(price)} {currency}
            </Text>
          </>
        )
      }
    </VStack>
  );
}

export default Today;
