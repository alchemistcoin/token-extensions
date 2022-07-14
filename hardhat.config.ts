import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

export enum CHAIN_IDS {
  ETHEREUM_MAINNET = 1,
  ETHEREUM_RINKEBY = 4,
  ETHEREUM_KOVAN = 42,
  POLYGON_MAINNET = 137,
  POLYGON_MUMBAI = 80001,
  ARBITRUM_MAINNET = 42161,
  ARBITRUM_RINKEBY = 421611,
  AVALANCHE_FUJI = 43113,
  AVALANCHE_MAINNET = 43114,
}

function getNetworkURL(networkId: number): string {
  switch (networkId) {
    case CHAIN_IDS.ETHEREUM_MAINNET:
      return `https://mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.ETHEREUM_KOVAN:
      return `https://kovan.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.ETHEREUM_RINKEBY:
      return `https://rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.POLYGON_MAINNET:
      return `https://polygon-mainnet.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.POLYGON_MUMBAI:
      return `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.ARBITRUM_MAINNET:
      return "https://arb1.arbitrum.io/rpc";
    case CHAIN_IDS.ARBITRUM_RINKEBY:
      return `https://arbitrum-rinkeby.infura.io/v3/${process.env.INFURA_PROJECT_ID}`;
    case CHAIN_IDS.AVALANCHE_MAINNET:
      return "https://api.avax.network/ext/bc/C/rpc";
    case CHAIN_IDS.AVALANCHE_FUJI:
      return "https://api.avax-test.network/ext/bc/C/rpc";
    default:
      return "";
  }
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more
const accounts =
  process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [];
const config: HardhatUserConfig = {
  solidity: "0.8.14",
  networks: {
    kovan: {
      url: getNetworkURL(CHAIN_IDS.ETHEREUM_KOVAN),
      accounts,
    },
    // goerli: {
    //   url: getNetworkURL(CHAIN_IDS.ETHEREUM_GOERLI),
    //   accounts,
    // },
    rinkeby: {
      url: getNetworkURL(CHAIN_IDS.ETHEREUM_RINKEBY),
      accounts,
    },
    mainnet: {
      url: getNetworkURL(CHAIN_IDS.ETHEREUM_MAINNET),
      accounts,
    },
    polygon: {
      url: getNetworkURL(CHAIN_IDS.POLYGON_MAINNET),
      accounts,
    },
    arbitrumOne: {
      url: getNetworkURL(CHAIN_IDS.ARBITRUM_MAINNET),
      accounts,
    },
    avalanche: {
      url: getNetworkURL(CHAIN_IDS.AVALANCHE_MAINNET),
      accounts,
    },
    fuji: {
      url: getNetworkURL(CHAIN_IDS.AVALANCHE_FUJI),
      accounts,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
