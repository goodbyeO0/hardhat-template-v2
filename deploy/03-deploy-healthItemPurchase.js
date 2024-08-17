const { network } = require("hardhat");
const { verify } = require("../utils/verify.js");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  const args = [];
  const healthItemPurchase = await deploy("HealthItemPurchase", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("Verifying ---------------------------");
  await verify(healthItemPurchase.address, args);
  log("done ---------------------------------------");
};
module.exports.tags = ["all", "hackathon", "main"];
