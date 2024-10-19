const { network, ethers } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  const args = [];
  const ethLocker = await deploy("EthLocker", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  // Get the contract instance
  const ethLockerContract = await ethers.getContractAt(
    "EthLocker",
    ethLocker.address
  );

  // Call the lockEth function with some ETH
  const lockEthTx = await ethLockerContract.lockEth({
    value: ethers.parseEther("0.1"),
  });
  const receiptLockEth = await lockEthTx.wait();

  console.log(receiptLockEth.logs[0].args.transactionHash);

  log("done ---------------------------------------");
};

module.exports.tags = ["all", "testEthKl", "main"];
