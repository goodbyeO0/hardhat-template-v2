const { network } = require("hardhat");
const { verify } = require("../utils/verify.js");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  const args = [];
  const ethKL = await deploy("EthLocker", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // log("Verifying ---------------------------");
  // await verify(ethKL.address, args);
  log("done ---------------------------------------");
};
module.exports.tags = ["all", "ethkl", "main"];
