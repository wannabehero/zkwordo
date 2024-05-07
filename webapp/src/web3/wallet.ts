import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  braveWallet,
  coinbaseWallet,
  frameWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createConfig } from 'wagmi';
import { polygon } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const ALCHEMY_KEY = import.meta.env.VITE_ALCHEMY_KEY ?? '';
const WC_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID ?? '';

export const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: ALCHEMY_KEY }), publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      injectedWallet({ chains }),
      ledgerWallet({ chains, projectId: WC_PROJECT_ID, walletConnectVersion: '2' }),
      frameWallet({ chains }),
      braveWallet({ chains }),
      metaMaskWallet({ chains, projectId: WC_PROJECT_ID, walletConnectVersion: '2' }),
      coinbaseWallet({ chains, appName: 'ZKWordo' }),
      rainbowWallet({ chains, projectId: WC_PROJECT_ID, walletConnectVersion: '2' }),
      safeWallet({ chains }),
      walletConnectWallet({ chains, projectId: WC_PROJECT_ID, version: '2' }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
