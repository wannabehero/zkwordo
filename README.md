# ZKWordo

ZK Wordo – simple game of guessing the word. If you've guessed it right – you generate a proof and submit it on-chain.
You proof will be verified and the ERC-1155 token will be minted.

There's a new Word every day.

The project uses ZKSnarks and on-chain proof verification.

## Snarks

The project utilizes `circom` [zk-circuit](./snarks/zkwordo.circom).

There're 64 words to form 6-level MerkleTree. Leaves of the tree are `hash([word,day])`,
where day is 0-based day number.

If the word is guessed correctly, prover (backend) generates a proof with the tree path to word.

The proof is then validated on-chain and ERC-1155 token is being issued.

Each proof incorporates a nullifier hash to prevent re-using the proofs.

<details>
  <summary>Bootstrap</summary>

  Install circom https://docs.circom.io/getting-started/installation/#installing-circom

    ```sh
    cd snarks

    # compile the circuit
    circom zkwordo.circom --r1cs --wasm --sym

    # ptau phases
    npx snarkjs powersoftau new bn128 15 pot14_0000.ptau -v
    npx snarkjs powersoftau contribute pot14_0000.ptau pot14_0001.ptau --name="ZKWordo" -v
    npx snarkjs powersoftau beacon pot14_0001.ptau pot14_beacon.ptau RANDOM_HEX_NUMBER_OF_62_LEN 10 -n="Final"
    npx snarkjs powersoftau prepare phase2 pot14_beacon.ptau pot14_final.ptau -v

    # export r1cs
    npx snarkjs r1cs export json zkwordo.r1cs zkwordo.r1cs.json

    # setup plonk verification
    npx snarkjs plonk setup zkwordo.r1cs pot14_final.ptau zkwordo_plonk.zkey

    # export the verification key
    npx snarkjs zkey export verificationkey zkwordo_plonk.zkey verification_key.json

    # export the verifier
    npx snarkjs zkey export solidityverifier zkwordo_plonk.zkey ../contracts/PlonkVerifier.sol
    ```

Then proceed normally.

</details>

## Backend

The backend is a quite simple nest.js project.

Blockchain interactions are based on `viem` and `@wagmi/cli` generated ABI definitions.


## Dev bootstrap

1. `npm install`
2. `npm run wagmi-generate`
3. Intialize your words: `cp data/words.json.example data/words.json` and then fill in your words and hints.

Then visit [backend](./backend/README.md) and [webapp](./webapp/README.md) to install their deps.

Run backend: `cd backend && npm run start:dev`.

Run webapp: `cd webapp && npm run dev`

Check [Snarks section](#snarks) to info on snarks bootstrap.