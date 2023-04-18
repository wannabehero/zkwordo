import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("ZKWordo", function () {
  const words = [
    "hello",
    "world"
  ];

  async function deployZKWordoFixture() {
    const [signer] = await ethers.getSigners();
    const ZKWordo = await ethers.getContractFactory("ZKWordo");
    const zkWordo = await ZKWordo.deploy(words);

    return { zkWordo, signer };
  }

  describe("Deployment", function () {
    it("Should set the right price", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      expect(await zkWordo.guessPrice()).to.equal(ethers.utils.parseEther("0.001"));
    });
  });

  describe("Validations", function () {
    it("Should revert if the wrong price", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      await expect(
        zkWordo.guess(
          "hello",
          {
            value: ethers.utils.parseEther("0.0001")
          }
        )
      ).to.be.revertedWith("ZKWordo: guess price mismatch");
    });

    it("Should revert for the second guess", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      await zkWordo.guess(
        "hello",
        {
          value: ethers.utils.parseEther("0.001")
        }
      );

      await expect(
        zkWordo.guess(
          "hello",
          {
            value: ethers.utils.parseEther("0.001")
          }
        )
      ).to.be.revertedWith("ZKWordo: already guessed today");
    });

    it("Should revert if spent all the guesses", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      for (let i = 0; i < 3; i++) {
        await zkWordo.guess(
          "test",
          {
            value: ethers.utils.parseEther("0.001")
          }
        );
      }

      await expect(
        zkWordo.guess(
          "hello",
          {
            value: ethers.utils.parseEther("0.001")
          }
        )
      ).to.be.revertedWith("ZKWordo: spent all the guesses today");
    });

    it("Should revert if game is over", async function () {
      const { zkWordo } = await loadFixture(deployZKWordoFixture);

      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 7 * 24 * 60 * 60));

      await expect(
        zkWordo.guess(
          "hello",
          {
            value: ethers.utils.parseEther("0.001")
          }
        )
      ).to.be.revertedWith("ZKWordo: game over");
    });
  });

  describe("Guessing", function () {
    it("Should mints a token for that day guess", async function () {
      const { zkWordo, signer } = await loadFixture(deployZKWordoFixture);

      await zkWordo.guess(
        "hello",
        {
          value: ethers.utils.parseEther("0.001")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 0)).to.equal(1);

      await time.increaseTo(Math.floor(new Date().getTime() / 1000 + 24 * 60 * 60));

      await zkWordo.guess(
        "world",
        {
          value: ethers.utils.parseEther("0.001")
        }
      );

      expect(await zkWordo.balanceOf(signer.address, 1)).to.equal(1);
    });
  });
});

