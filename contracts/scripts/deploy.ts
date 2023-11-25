import { parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const HealthRecordManager = await hre.viem.deployContract(
    "HealthRecordManager",
    ["dev@gmail.com"]
  );

  const payManager = await hre.viem.deployContract(
    "contracts/PayManagerV2.sol:PayManager",
    ["0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"]
  );

  await HealthRecordManager.write.addPayManager([payManager.address]);
  await payManager.write.setRecordManager([
    "0xcc5307ba8e8c4138ec390b4c3378bc56a3dd78e9",
  ]);
  await payManager.write.addFund({ value: parseEther("0.3", "wei") });
  await payManager.write.addStake([60 * 60 * 24], {
    value: parseEther("0.11", "wei"),
  });

  console.log(
    `Health Record Manager is deployed at ${HealthRecordManager} Pay Manager v2 is deployed at ${payManager.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
