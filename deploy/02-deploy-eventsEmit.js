const { network, ethers } = require("hardhat");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("--------------------------------------");
  const args = [];
  const eventsEmit = await deploy("EventsEmit", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  // console.log(eventsEmit, "\n\n\n");

  // Get the contract instance
  const eventsEmitContract = await ethers.getContractAt(
    "EventsEmit",
    eventsEmit.address
  );

  // Call the store function
  const storeNumber1 = await eventsEmitContract.store(19018982929);
  const receiptStore1 = await storeNumber1.wait();
  // Parse and display the emitted events
  //   const eventInterface = new ethers.Interface([
  //     "event storedNumber(uint256 indexed oldNumber, uint256 indexed newNumber, uint256 addedNumber, address sender)",
  //   ]);
  console.log(receiptStore1.logs[0].args.newNumber);

  //   receiptStore1.logs.forEach((log) => {
  //     try {
  //       const parsedLog = eventInterface.parseLog(log);
  //       console.log(parsedLog);
  //     } catch (e) {
  //       // Ignore logs that do not match the event signature
  //     }
  //   });
  log("done ---------------------------------------");
};
module.exports.tags = ["all", "eventsEmit", "main"];
