import { createHash } from "crypto";
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

export async function generateCircuit(words: string[]) {
  const provider = await initialize();

  const { source, encoded } = createCircuit(words);
  const artifacts = provider.compile(source);
  const keypair = provider.setup(artifacts.program);

  const verifier = provider.exportSolidityVerifier(keypair.vk);
  return { verifier, keypair, artifacts, encoded, provider };
}