import { Address } from 'viem';

export interface ProofResponse {
  proof: Address;
  nullifierHash: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
}
