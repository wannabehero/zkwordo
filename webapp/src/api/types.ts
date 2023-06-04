import { Address } from 'viem';

export interface ProofResponse {
  proof: Address;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
}
