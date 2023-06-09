import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  braveWallet,
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY ?? '';
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID ?? '';

export const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      braveWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ appName: 'ZKWordo', chains }),
      rainbowWallet({ chains }),
      safeWallet({ chains }),
      walletConnectWallet({ projectId: WC_PROJECT_ID, chains }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
