import { ethers } from "hardhat";

import NwProofJson from "../circuits/proof.json";

async function deploy() {
  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();

  const ZKWordo = await ethers.getContractFactory("ZKWordo");
  const zkWordo = await ZKWordo.deploy(verifier.address);

  await zkWordo.deployed();

  console.log(
    `zkWordo deployed at ${zkWordo.address}`
  );

  return zkWordo.address;
}

async function guess() {
  const address = await deploy();
  const zkWordo = await ethers.getContractAt("ZKWordo", address);

  const proof = {
    a: {
      X: ethers.BigNumber.from(NwProofJson.proof.a[0]),
      Y: ethers.BigNumber.from(NwProofJson.proof.a[1]),
    },
    b: {
      X: [
        ethers.BigNumber.from(NwProofJson.proof.b[0][0]),
        ethers.BigNumber.from(NwProofJson.proof.b[0][1]),
      ],
      Y: [
        ethers.BigNumber.from(NwProofJson.proof.b[1][0]),
        ethers.BigNumber.from(NwProofJson.proof.b[1][1]),
      ]
    },
    c: {
      X: ethers.BigNumber.from(NwProofJson.proof.c[0]),
      Y: ethers.BigNumber.from(NwProofJson.proof.c[1]),
    },
  };

  // @ts-expect-error - Proof is actually compatible with the contract
  await zkWordo.guess(proof, {
    value: ethers.utils.parseEther("0.001")
  });
}

guess().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
