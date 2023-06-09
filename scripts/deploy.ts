import { ethers } from 'hardhat';

async function deploy() {
  const Verifier = await ethers.getContractFactory('PlonkVerifier');
  const verifier = await Verifier.deploy();
  await verifier.deployed();

  const ZKWordo = await ethers.getContractFactory('ZKWordo');
  const zkWordo = await ZKWordo.deploy(
    verifier.address,
    64,
    '2230153193710028632835566707752987226152474453372814143796347740820915755932',
  );
  await zkWordo.deployed();

  console.log(`zkWordo deployed at ${zkWordo.address}`);

  return zkWordo.address;
}

async function guess() {
  const address = await deploy();
  const zkWordo = await ethers.getContractAt('ZKWordo', address);

  const proof =
    '0x2d428c1485e9fc4cae7e2eb5512aeecfc46adb1622f3d0b9ed295929fa85628f291bb502571acf47ba79780ed8677b0923b866ae76135f0defbb99a02489ad671af6e7406ad64c7ce8d1ce1c53611155178ae68a24ef3bf14a32051e7323db3e0ecf422ec0d9a4874cfd0b9653e331828a9b08070ebb0d3b74b5adb026875a090bba8a2fe93d6079f31f138a3c77b557a7b716c36e32692dcf85a443c557d87613ea6c1ace6dc08059b74150fc67de426d56f4c298a8032be5bb217dfc794fb91067a8dbc8e12a9abda8be8dc58c332a8c0fdc188fa0f4397627a5bb8a4311c20baf7919e09be999060731cdf5ae08afaed3ea66f74c6f87225a36e1687072fb0e66c445dbc9e69fd4d285d8767519fb8bb04e29ab801009a7b01433a0158c481762edef1670c6bc55852d5a1248af515f7fdec9bb2246f5aee3072298530f25023dc718b321c6dc0fe6e63e1a6df18022420aaac5a143267f53079f42a6af911b2cb5466c7a89e1056c2dbd020a2a61a649acfd26e9e81b620c93cf6828e56e04bd2525f217902c6bd9de79e8e49c5a083854f72763f3bb3fde6bde18b59eb41de3c37863185609f6f0b383059979c1ef386af09d1b8071ba7936c49028d2f409a0d4ac4b79d74cf83a2cdb1a826223ce41066d35a44db18a59afdb6e2c33db041e117deef968805330db95fed4506305c2ca25e6870c6b6e14617a560fe97a1cf90405f56cd6bc79a813f366fd7650050df67cfc19dd6256ce84d748e86e080023d795852371ceb06a9a9ed96df16725530b35a0bfc942983a63224a0d01df0986650176cbc6c470ad7229a1115c78a45c62cb497b3ade2420bd19e1a60db6023a3808157dbd6baf7fa67c2b58592edfb6366b22bdcf5ecf2100f10b7c58c41a5123f0d2ce47f31fce768680a8d82c10029f53ac3e0ab6a21c9a23e9a0433c0c9122e1efd5b13a09442d2fcbb7baff4803c3ca1f4bb22ec2f41043abe189c105e0febbede23c4b216dcaf8ef3f2d6287f9eba3cc7d7a7731f3fe596ee04b071416d41417e02128a85629688b93b349ad5b2fdb082a234d4f3c0bb7bf623563010f836951584aca86575808e041823a3195ebef23ce1d060d59c5e38d141c5f';
  const nullifierHash = '16797150292432903501101656712051881747747970945313040968929866983040639381582';

  const tx = await zkWordo.guess(nullifierHash, proof, {
    value: ethers.utils.parseEther('0.01'),
  });
  const receipt = await tx.wait();
  console.log(receipt.logs.map((log) => zkWordo.interface.parseLog(log).name));
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
