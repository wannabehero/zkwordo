import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 9999
          }
        }
      }
    ]
  },
  networks: {
    zkevm: {
      accounts,
      url: "https://rpc.public.zkevm-test.net",
    },
    mumbai: {
      accounts,
      url: "https://rpc.ankr.com/polygon_mumbai",
    },
    local: {
      url: "http://127.0.0.1:8545",
    },
    polygon: {
      accounts,
      url: "https://polygon-rpc.com",
    },
    truffle: {
      url: "http://localhost:24012/rpc",
    },
    "base-sepolia": {
      accounts,
      url: "https://sepolia.base.org",
    },
    base: {
      accounts,
      url: "https://mainnet.base.org",
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
    customChains: [
      {
        network: "zkevm",
        chainId: 1442,
        urls: {
          apiURL: "https://testnet-zkevm.polygonscan.com/api",
          browserURL: "https://testnet-zkevm.polygonscan.com"
        }
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
         apiURL: "https://api-sepolia.basescan.org/api",
         browserURL: "https://sepolia.basescan.org"
        }
      },
      {
        network: "base",
        chainId: 8453,
        urls: {
         apiURL: "https://api.basescan.org/api",
         browserURL: "https://basescan.org"
        }
      }
    ]
  }
};

export default config;
