import './App.css';
import { ColorModeScript, Container, VStack, theme, useColorMode } from '@chakra-ui/react'
import Header from './components/Header'
import TodayScreen from './screens/TodayScreen';
import { WagmiConfig } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit';
import { chains, wagmiConfig } from './web3/wallet'


function App() {
  const { colorMode } = useColorMode();

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={colorMode === 'light' ? lightTheme() : darkTheme()}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Container className="app">
          <VStack align="stretch">
            <Header />
            <TodayScreen />
          </VStack>
        </Container>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App;
