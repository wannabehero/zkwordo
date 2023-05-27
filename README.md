# ZKWordo

ZK Wordo – simple game of guessing the word. If you've guessed it right – you generate a proof and submit it on-chain.
You proof will be verified and the ERC-1155 token will be minted.

There's a new Word every day.

The project uses ZKSnarks and on-chain proof verification.

## TODO
- [x] Add a script to generate word bytes
- [x] Add scripts to work with Zokrates from nodejs env + interact with the contract
- [x] Fix tests to work with Verifier
- [x] Deploy metadata server
- [x] Migrate from zokrates to snarkjs
- [ ] Deploy to testnets
- [ ] Create simple one-page POC UI
- [ ] Extend the documentation

## Snarks

Install circom https://docs.circom.io/getting-started/installation/#installing-circom

```sh
cd snarks

# compile the circuit
circom words.circom --r1cs --wasm --sym

# ptau phases
npx snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
npx snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="ZKWordo" -v
npx snarkjs powersoftau beacon pot14_0001.ptau pot14_beacon.ptau RANDOM_HEX_NUMBER_OF_62_LEN 10 -n="Final"
npx snarkjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v

# export r1cs
npx snarkjs r1cs export json words.r1cs words.r1cs.json

# setup plonk verification
npx snarkjs plonk setup words.r1cs pot14_final.ptau words_plonk.zkey

# export the verification key
npx snarkjs zkey export verificationkey words_plonk.zkey verification_key.json

# export the verifier
npx snarkjs zkey export solidityverifier words_plonk.zkey ../contracts/PlonkVerifier.sol
```

Then proceed normally.