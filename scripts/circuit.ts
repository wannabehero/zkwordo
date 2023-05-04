import * as fs from "fs";
import { createHash } from "crypto";
import { ethers } from "hardhat";
import { initialize } from "zokrates-js";

function createCircuit(words: string[]) {
  const encoded = words
    .map((word) => createHash("sha256").update(word).digest());

  const source = `
    def main(private field[32] word, u32 day, field account) -> field {
      field[${encoded.length}][32] words = [
        ${encoded.map((digest) => `[${digest.join(",")}]`).join(",")}
      ];
      assert(words[day] == word);
      return account;
    }
  `;

  return { source, encoded };
}

async function selialize() {
  const { verifier, artifacts } = await generateCircuit(["foo", "bar", "kek"]);

  if (!fs.existsSync("./artifacts/zk")) {
    fs.mkdirSync("./artifacts/zk", { recursive: true });
  }

  fs.writeFileSync("./artifacts/zk/Verifier.sol", verifier);
  fs.writeFileSync("./artifacts/zk/program.json", JSON.stringify({
    program: [...artifacts.program],
    abi: artifacts.abi,
  }));
}

export async function generateCircuit(words: string[]) {
  const provider = await initialize();

  const { source, encoded } = createCircuit(words);
  const artifacts = provider.compile(source);
  const keypair = provider.setup(artifacts.program);

  const verifier = provider.exportSolidityVerifier(keypair.vk);
  return { verifier, keypair, artifacts, encoded, provider };
}

selialize().catch((err) => {
  console.error(err);
  process.exit(1);
});
