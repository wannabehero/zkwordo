import { ethers } from 'hardhat';
// @ts-ignore snarksjs is not typed
import * as snarkjs from 'snarkjs';

async function deploy() {
  const PlonkVerifier = await ethers.getContractFactory('PlonkVerifier');
  const verifier = await PlonkVerifier.deploy();
  await verifier.deployed();
  console.log('PlonkVerifier deployed to:', verifier.address);
  return verifier;
}

async function run() {
  const [signer] = await ethers.getSigners();

  const address = ethers.BigNumber.from(signer.address).toString();

  const payload = {
    guess: [
      218, 47, 7, 62, 6, 247, 137, 56, 22, 111, 36, 114, 115, 114, 157, 254, 70, 91, 247, 228, 97,
      5, 193, 60, 231, 204, 101, 16, 71, 191, 12, 164,
    ],
    day: 1,
    addressIn: address,
  };

  const { proof, publicSignals } = await snarkjs.plonk.fullProve(
    payload,
    'snarks/words_js/words.wasm',
    'snarks/words_plonk.zkey',
  );

  const calldata: string = await snarkjs.plonk.exportSolidityCallData(proof, publicSignals);

  const verifier = await deploy();

  const [, ...params] = calldata.match(/^(0x[\w]+),(\[.+\])$/)!;

  const success = await verifier.verifyProof(params[0], [32, address, 1, address]);

  console.log('success', success);
}

run().then(() => {
  process.exit(0);
});
