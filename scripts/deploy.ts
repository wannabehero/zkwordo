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
    '20622826805476868759931841248391750897343639818245496266274682394406151398524',
  );
  await zkWordo.deployed();

  console.log(`zkWordo deployed at ${zkWordo.address}`);

  return zkWordo.address;
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
