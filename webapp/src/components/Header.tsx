import { Button, Flex, Spacer, Text, useColorMode } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex align="baseline">
      <Text as="b" fontSize="xl">
        ZKWordo
      </Text>
      <Spacer />
      <Button onClick={toggleColorMode} variant="ghost" size="md" borderRadius="xl" mr={2}>
        {colorMode === 'light' ? '🌚' : '🌝'}
      </Button>
      <ConnectButton />
    </Flex>
  );
};

export default Header;
