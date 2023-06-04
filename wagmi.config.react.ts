import { defineConfig } from '@wagmi/cli'
import { react, hardhat } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'webapp/src/web3/contracts.ts',
  contracts: [
  ],
  plugins: [
    react({
      useContractEvent: false,
    }),
    hardhat({
      project: '.',
      include: ['*/ZKWordo.sol/**'],
    }),
  ],
})
