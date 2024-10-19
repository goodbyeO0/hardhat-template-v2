const { network } = require("hardhat");
const { verify } = require("../utils/verify.js");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  const args = ["0x93Ab4B67E111FcD35D58CfA10E1a433114E82A5a", 172800];
  const quadraticFunding = await deploy("QuadraticFunding", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log("Verifying ---------------------------");
  await verify(quadraticFunding.address, args);
  log("done ---------------------------------------");
};
module.exports.tags = ["all", "qf", "main"];
