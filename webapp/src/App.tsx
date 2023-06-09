import './App.css';

import { ColorModeScript, Container, theme, useColorMode, VStack } from '@chakra-ui/react';
import { darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';

import Header from './components/Header';
import TodayScreen from './screens/TodayScreen';
import { chains, wagmiConfig } from './web3/wallet';

function App() {
  const { colorMode } = useColorMode();

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        theme={colorMode === 'light' ? lightTheme() : darkTheme()}
        showRecentTransactions
      >
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Container className="app">
          <VStack align="stretch">
            <Header />
            <TodayScreen />
          </VStack>
        </Container>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
