import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
// @ts-expect-error no typesdev for solc
import solc from "solc";
import { CompilationArtifacts, SetupKeypair, ZoKratesProvider } from "zokrates-js";

import { generateCircuit } from "../scripts/circuit";

interface ZK {
  provider: ZoKratesProvider;
  artifacts: CompilationArtifacts;
  encoded: Buffer[];
  keypair: SetupKeypair;
}

describe("ZKWordo", function () {
  const words = [
    "hello",
    "world"
  ];

  async function deployVerifierFixture() {
    const [signer] = await ethers.getSigners();

    const { verifier: verifierSrc, provider, artifacts, encoded, keypair } = await generateCircuit(words);
    const { contracts } = JSON.parse(
      solc.compile(JSON.stringify({
        language: "Solidity",
        sources: {
          "Verifier.sol": {
            content: verifierSrc
          }
        },
        settings: {
          outputSelection: {
            "*": {
              "*": ["*"]
            }
          }
        }
      }))
    );

    const compiled = contracts["Verifier.sol"]["Verifier"];

    const Verifier = new ethers.ContractFactory(
      compiled.abi,
      contracts["Verifier.sol"]["Verifier"].evm.bytecode,
      signer
    );

    const verifier = await Verifier.deploy();
    return {
      verifier,
      zk: {
        provider,
        artifacts,
        encoded,
        keypair
      }
    };
  }

  async function deployZKWordoFixture() {
    const { verifier, zk } = await loadFixture(deployVerifierFixture);

    const [signer, another] = await ethers.getSigners();
    const ZKWordo = await ethers.getContractFactory("ZKWordo");
    const zkWordo = await ZKWordo.deploy(verifier.address);

    return { zkWordo, signer, zk, another };
  }

  function generateProof(zk: ZK, day: number, account: string) {
    const { witness } = zk.provider.computeWitness(
      zk.artifacts,
      [
        [...zk.encoded[day]].map((n) => n.toString()),
        day.toString(),
        ethers.BigNumber.from(account).toString()
      ]
    );
    const { proof } = zk.provider.generateProof(
      zk.artifacts.program,
      witness,
      zk.keypair.pk
    );

    return proof as any;
  }

  describe("Deployment", function () {
    it("Should deploy the verifier", async function () {
      const { verifier } = await loadFixture(deployVerifierFixture);

      expect(verifier.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should set the right price", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      expect(await zkWordo.guessPrice()).to.equal(ethers.utils.parseEther("0.01"));
    });
  });

  describe("Metadata", function () {
    it("Should return the right metadata", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      expect(await zkWordo.contractURI()).to.equal("https://api.zkwordo.xyz/api/metadata/contract");
      expect(await zkWordo.uri(69420)).to.equal("https://api.zkwordo.xyz/api/metadata/token/69420");
    });
  });

  describe("Validations", function () {
    it("Should revert if the wrong price", async function () {
      const { zkWordo, zk, signer } = await loadFixture(deployZKWordoFixture);

      const proof = generateProof(zk, 0, signer.address);

      await expect(
        zkWordo.guess(
          proof,
          {
            value: ethers.utils.parseEther("0.0001")
          }
        )
      ).to.be.revertedWith("ZKWordo: guess price mismatch");
    });

    it("Should revert for the second guess", async function () {
      const { zkWordo, zk, signer } = await loadFixture(deployZKWordoFixture);

      const proof = generateProof(zk, 0, signer.address);

      await zkWordo.guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      await expect(
        zkWordo.guess(
          proof,
          {
            value: ethers.utils.parseEther("0.01")
          }
        )
      ).to.be.revertedWith("ZKWordo: already guessed today");
    });
  });

  describe("Guessing", function () {
    it("Should mint a token for that day guess", async function () {
      const { zkWordo, zk, signer } = await loadFixture(deployZKWordoFixture);

      const proof0 = generateProof(zk, 0, signer.address);

      await zkWordo.guess(
        proof0,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 0)).to.equal(1);

      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 24 * 60 * 60));

      const proof1 = generateProof(zk, 1, signer.address);

      await zkWordo.guess(
        proof1,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 1)).to.equal(1);
    });

    it("Should not mint a token for the wrong guesser", async function () {
      const { zkWordo, zk, signer, another } = await loadFixture(deployZKWordoFixture);

      const proof = generateProof(zk, 0, signer.address);

      await zkWordo.connect(another).guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      expect(await zkWordo.balanceOf(another.address, 0)).to.equal(0);
    });
  });

  describe("Events", function () {
    it("Should emit a GuessedCorrectly event", async function () {
      const { zkWordo, zk, signer } = await loadFixture(deployZKWordoFixture);

      const proof = generateProof(zk, 0, signer.address);

      await expect(zkWordo.guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      )).to.emit(zkWordo, "GuessedCorrectly").withArgs(signer.address, 0);
    });

    it("Should emit a GuessedIncorrectly event", async function () {
      const { zkWordo, zk, signer, another } = await loadFixture(deployZKWordoFixture);

      const proof = generateProof(zk, 0, signer.address);

      await expect(zkWordo.connect(another).guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      )).to.emit(zkWordo, "GuessedIncorrectly").withArgs(another.address, 0);
    });
  });

  describe("Withdrawal", function () {
    it("Should withdraw correctly", async function () {
      const { zkWordo, zk, signer } = await loadFixture(deployZKWordoFixture);

      const proof0 = generateProof(zk, 0, signer.address);

      await zkWordo.guess(
        proof0,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      await expect(zkWordo.withdraw(signer.address))
        .to.changeEtherBalances(
          [signer, zkWordo],
          [ethers.utils.parseEther("0.01"), ethers.utils.parseEther("-0.01")]);
    });
  });
});

