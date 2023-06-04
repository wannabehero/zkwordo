import { CheckIcon, CloseIcon, } from '@chakra-ui/icons';
import {
  Card,
  CardBody,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { Word } from '../types/word';

interface WordsProps {
  words: Word[] | null;
}

const Words = ({ words }: WordsProps) => {
  const [openWord, setOpenWord] = useState<Word | null>(null);

  return (
    <>
      <VStack align="stretch">
        <Text fontSize="lg">Previous words</Text>
        {
          words && (
            <VStack align="stretch">
              {words.map((word, idx) => (
                <Card key={`card-word-${idx}`}
                  _hover={{ opacity: 0.8, cursor: 'pointer' }}
                  onClick={() => setOpenWord(word)}
                >
                  <CardBody>
                    <Flex align="center">
                      <Text>{word.word}</Text>
                      <Spacer />
                      {
                        word.guessed === true && (
                          <CheckIcon color="green.500" />
                        )
                      }
                      {
                        word.guessed === false && (
                          <CloseIcon color="red.500" />
                        )
                      }
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )
        }
      </VStack>
      <Modal isOpen={openWord !== null} onClose={() => setOpenWord(null)}>
        <ModalOverlay />
        {
          openWord && (
            <ModalContent>
              <ModalHeader>{openWord.word}</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={8}>
                <Image
                  src={`https://api.zkwordo.xyz/api/image/day/${openWord.id}`}
                  alt={openWord.word}
                />
              </ModalBody>
            </ModalContent>
          )
        }
      </Modal>
    </>
  );
};

export default Words;
