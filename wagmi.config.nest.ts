import { defineConfig } from '@wagmi/cli'
import { react, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'backend/src/web3/contracts.ts',
  contracts: [],
  plugins: [
    hardhat({
      project: '.',
      include: ['*/ZKWordo.sol/**'],
    }),
  ],
})
