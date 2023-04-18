import { ethers, run } from "hardhat";

const words = [
  "polygon",
  "crypto",
  "ethereum",
  "empatika",
  "squeek",
  "uniswap",
  "bankless",
];

async function main() {
  const ZKWordo = await ethers.getContractFactory("ZKWordo");
  const zkWordo = await ZKWordo.deploy(words);

  await zkWordo.deployed();

  console.log(
    `zkWordo deployed at ${zkWordo.address} with ${words.length} words`
  );
}

async function verify() {
  await run("verify:verify", {
    address: "0x64D917d89f94eFC3253CE1b3fD32dd90A5f67085",
    constructorArguments: [
      words
    ],
  });
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
