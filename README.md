# ZKWordo

ZK Wordo – simple game of guessing the word. If you've guessed it right – you generate a proof and submit it on-chain.
You proof will be verified and the ERC-1155 token will be minted.

There's a new Word every day.

The project uses ZKSnarks and on-chain proof verification.

## TODO
- [ ] Add a script to generate word bytes
- [ ] Add scripts to work with Zokrates from nodejs env + interact with the contract
- [ ] Fix tests to work with Verifier
- [ ] Extend the documentation
- [ ] Deploy to testnets

### Zokrates usage

Refer to https://zokrates.github.io/gettingstarted.html to install zokrates.

At the time of writing it's:
```sh
curl -LSfs get.zokrat.es | sh
```

Then do the following:
```sh
cd circuits

# update the words in zkwordo.zok first
# it's sha256 bytes of the word

# 1. compile the circuit
zokrates compile -i zkwordo.zok

# 2. run setup
zokrates setup

# 3. compute the witness
zokrates compute-witness -a 43 59 24 18 9 36 29 63 60 194 251 50 66 138 45 68 44 187 130 101 88 152 145 219 232 210 248 87 44 208 142 191 0 1390849295786071768276380950238675083608645509734
# first goes sha256 bytes (all 32 of them) of the word, then day number, then uint(your-wallet-address)

# 4. generate the proof
zokrates generate-proof

# 5. export the solidity verifier
zokrates export-verifier

# at this point you want to replace the Verifier with yours
mv verifier.sol ../contracts/Verifier.sol
```

Then proceed normally.