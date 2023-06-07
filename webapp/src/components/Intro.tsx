import { ExternalLinkIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Highlight,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react';

const Intro = () => {
  return (
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
                  the smart contract.
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
  );
};

export default Intro;
