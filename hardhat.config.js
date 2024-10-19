require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-verify");
require("dotenv").config();
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SCROLL_RPC_URL = process.env.SCROLL_RPC_URL; // Ensure this line is added
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COINMARKET_API_KEY = process.env.COINMARKET_API_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const SCROLL_API_KEY = process.env.SCROLL_API_KEY;
const BASE_API_KEY = process.env.BASE_API_KEY;

module.exports = {
  defaultNetwork: "hardhat",
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
    },
    manta: {
      url: "https://pacific-rpc.sepolia-testnet.manta.network/http", // Insert your RPC URL Here
      chainId: 3441006, //Insert your ChainID Here
      blockConfirmations: 2,
      accounts: [PRIVATE_KEY],
    },
    scrollSepolia: {
      url: SCROLL_RPC_URL, // Ensure this line is added
      accounts: [PRIVATE_KEY], // Ensure this line is added
      chainId: 534351, // Replace with the correct chain ID for Scroll Sepolia
      blockConfirmations: 2, // Ensure this line is added
    },
    base_sepolia: {
      url: "https://sepolia.base.org",
      accounts: [PRIVATE_KEY],
      verify: {
        etherscan: {
          apiUrl: "https://api-sepolia.basescan.org",
          apiKey: ETHERSCAN_API_KEY
        }
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
  etherscan: {
    apiKey: {
      baseSepolia: BASE_API_KEY, // Add your API key here
      scrollSepolia: SCROLL_API_KEY, // Ensure this line is added
    },
    customChains: [
      {
        network: "baseSepolia",
        chainId: 534351, // Replace with the correct chain ID for Base Sepolia
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api", // Ensure this line is added
          browserURL: "https://sepolia.basescan.org/", // Ensure this line is added
        },
      },
    ],
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKET_API_KEY,
    token: "MATIC",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    user: {
      default: 1,
    },
  },
};
