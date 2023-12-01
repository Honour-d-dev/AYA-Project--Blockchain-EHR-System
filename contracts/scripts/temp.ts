import { parseEther } from "viem";
import hre from "hardhat";

async function main() {
  const HealthRecordManager = await hre.viem.deployContract(
    "HealthRecordManagerV2",
    ["honourumunna@gmail.com"]
  );

  const pmV2 = await hre.viem.getContractAt(
    "contracts/PayManagerV2.sol:PayManager",
    "0xdf8ff2de45cfdddfe20c1b924f56818db083d1e7"
  );

  await pmV2.write.setRecordManager([HealthRecordManager.address]);

  console.log(`${HealthRecordManager.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
