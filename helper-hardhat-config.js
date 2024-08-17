const networkConfig = {
  11155111: {
    name: "sepolia",
    ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    interval: "30",
    subscriptionId: "8427",
    callbackGasLimit: "500000", // 500,000 gas
    mintFee: "1000000000000000",
    vrfCoordinatorV2: "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625", // Add the correct VRF Coordinator address for Sepolia
  },
  31337: {
    name: "localhost",
    gasLane:
      "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c", // 30 gwei
    keepersUpdateInterval: "30",
    callbackGasLimit: "500000", // 500,000 gas
    mintFee: "1000000000000000", // 0.01 ETH
    vrfCoordinatorV2: "", // You can leave this empty for localhost since it's mocked
  },
};

const developmentChains = ["hardhat", "localhost"];
const DECIMALS = 8;
const INITIAL_ANSWER = 20000000000;

module.exports = {
  networkConfig,
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
};
