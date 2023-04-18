import { ethers, run } from "hardhat";

async function main() {
  const zkWordo = await ethers.getContractAt("ZKWordo", "0x64D917d89f94eFC3253CE1b3fD32dd90A5f67085");

  await zkWordo.guess("polygon", {
    value: ethers.utils.parseEther("0.001"),
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
