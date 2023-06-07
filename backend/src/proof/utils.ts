export function bufferToBigInt(buffer: Buffer): bigint {
  return BigInt(`0x${buffer.toString('hex')}`);
}

export function stringToBigInt(value: string): bigint {
  return bufferToBigInt(Buffer.from(value));
}
