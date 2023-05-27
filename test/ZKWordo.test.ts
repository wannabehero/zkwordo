import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZKWordo", function () {
  async function deployVerifierFixture() {
    const Verifier = await ethers.getContractFactory("MockVerifier");
    const verifier = await Verifier.deploy();
    return {
      verifier,
    };
  }

  async function deployZKWordoFixture() {
    const { verifier } = await loadFixture(deployVerifierFixture);

    const [signer, another] = await ethers.getSigners();
    const ZKWordo = await ethers.getContractFactory("ZKWordo");
    const zkWordo = await ZKWordo.deploy(verifier.address);

    return { zkWordo, signer, another };
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
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");

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
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");

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
      const { zkWordo, signer } = await loadFixture(deployZKWordoFixture);

      const proof0 = ethers.utils.toUtf8Bytes("test");

      await zkWordo.guess(
        proof0,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 0)).to.equal(1);

      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 48 * 60 * 60));

      const proof2 = ethers.utils.toUtf8Bytes("test");

      await zkWordo.guess(
        proof2,
        {
          value: ethers.utils.parseEther("0.01")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 2)).to.equal(1);
    });

    it("Should not mint a token for bad proof", async function () {
      const { zkWordo, another } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");
      // mock fails for day = 1
      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 24 * 60 * 60));

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
      const { zkWordo, signer } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");

      await expect(zkWordo.guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      )).to.emit(zkWordo, "GuessedCorrectly").withArgs(signer.address, 0);
    });

    it("Should emit a GuessedIncorrectly event", async function () {
      const { zkWordo, another } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");
      // mock fails for day = 1
      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 24 * 60 * 60));

      await expect(zkWordo.connect(another).guess(
        proof,
        {
          value: ethers.utils.parseEther("0.01")
        }
      )).to.emit(zkWordo, "GuessedIncorrectly").withArgs(another.address, 1);
    });
  });

  describe("Withdrawal", function () {
    it("Should withdraw correctly", async function () {
      const { zkWordo, signer } = await loadFixture(deployZKWordoFixture);

      const proof = ethers.utils.toUtf8Bytes("test");

      await zkWordo.guess(
        proof,
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

