const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify.js");
const {
  storeImages,
  storeTokenUriMetadata,
} = require("../utils/uploadToPinata.js");
require("dotenv").config();

const imageLocation = "./img";

const metadataTemplate = {
  name: "",
  description: "",
  image: "",
  attributes: [
    {
      trait_type: "Cuteness",
      value: 100,
    },
  ],
};

let tokenUris = [
  "ipfs://QmbDwArpYUrvr17oXGt2xm3uREDX6xjJa6XfoEHhxnYjfi",
  "ipfs://QmXpaezx8M2ikYcL27C89wStCKHUgiY9onBsNB9HQpRvHR",
  "ipfs://QmZvKSM82UAdMGiTVWHqkZJctmamS14TEVSbpRBq8kuH58",
];
const FUND_AMOUNT = "1000000000000000000000";

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (process.env.UPLOAD_TO_PINATA == "true") {
    tokenUris = await handleTokenUris();
  }

  let vrfCoordinatorV2Address, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const VRFCoordinatorV2Mock = await get("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address;
    const vrfCoordinatorV2MockContract = await ethers.getContractAt(
      "VRFCoordinatorV2Mock",
      vrfCoordinatorV2Address
    );
    const tx = await vrfCoordinatorV2MockContract.createSubscription();
    const txReceipt = await tx.wait(1);
    subscriptionId = txReceipt.logs[0].args.subId;
    await vrfCoordinatorV2MockContract.fundSubscription(
      subscriptionId,
      FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId].vrfCoordinatorV2;
    subscriptionId = networkConfig[chainId].subscriptionId;
  }

  log("----------------------------------------------");

  // Corrected order of arguments
  const args = [
    vrfCoordinatorV2Address,
    subscriptionId,
    networkConfig[chainId].gasLane,
    networkConfig[chainId].callbackGasLimit,
    tokenUris, // string[3] memory dogTokenUris
    networkConfig[chainId].mintFee, // uint256 mintFee
  ];

  // Log each argument to ensure they are correctly defined
  console.log("Arguments for deployment:");
  args.forEach((arg, index) => {
    console.log(`arg[${index}]: ${arg}`);
  });

  // Deploy the RandomIpfsNft contract
  try {
    const randomIpfsNft = await deploy("RandomIpfsNft", {
      from: deployer,
      args: args,
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
    ) {
      await verify(randomIpfsNft.address, args);
    }
  } catch (error) {
    console.error("Error during deployment:", error.message);
  }
};

async function handleTokenUris() {
  let tokenUris = [];
  // store the image in IPFS
  // store the metadata in IPFS
  const { responses: imageUploadResponse, files: files } = await storeImages(
    imageLocation
  );
  for (let i = 0; i < 3; i++) {
    let tokenUriMetadata = { ...metadataTemplate };
    tokenUriMetadata.name = files[i].replace(".png", "");
    tokenUriMetadata.description = "An adorable dog";
    tokenUriMetadata.image = `ipfs://${imageUploadResponse[i].IpfsHash}`;
    console.log(`Uploading ${tokenUriMetadata.name} .......`);
    const metadataUploadResponse = await storeTokenUriMetadata(
      tokenUriMetadata
    );
    tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`);
    console.log("Token URIs uploaded! They are: ");
    console.log(tokenUris);
  }
  return tokenUris;
}

module.exports.tags = ["all", "randomipfs", "main"];
