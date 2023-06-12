import { ethers } from 'hardhat';

async function deploy() {
  const Verifier = await ethers.getContractFactory('PlonkVerifier');
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  console.log(`Verifier deployed at ${verifier.address}`);

  const ZKWordo = await ethers.getContractFactory('ZKWordo');
  const zkWordo = await ZKWordo.deploy(
    verifier.address,
    64,
    '16025073412500829627652015076968910326194896554081409701895666739493672514376',
  );
  await zkWordo.deployed();

  console.log(`zkWordo deployed at ${zkWordo.address}`);

  return zkWordo.address;
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
