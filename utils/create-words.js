#!/usr/bin/env node

const { createHash } = require("crypto");

function convertWords(words) {
  const encoded = words
    .map((word) => createHash("sha256").update(word).digest());
  return encoded.map((word) => `[${[...word]}]`);
}

const words = process.argv.slice(2);

const converted = convertWords(words);
console.log(converted.join(",\n"));
