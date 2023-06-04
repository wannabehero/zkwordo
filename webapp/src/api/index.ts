import { Word } from '../types/word';
import { ErrorResponse, ProofResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export async function generateProof(
  word: string,
  account: string,
): Promise<ProofResponse | ErrorResponse> {
  const url = `${BASE_URL}/proof/generate`;
  const response: ProofResponse | ErrorResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      word,
      account,
    }),
  }).then((res) => res.json());
  return response;
}

export async function generateSignedProof(
  word: string,
  signature: string,
): Promise<ProofResponse | ErrorResponse> {
  const url = `${BASE_URL}/proof/generate-signed`;
  const response: ProofResponse | ErrorResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ word, signature }),
  }).then((res) => res.json());
  return response;
}

export async function getTodayHint(): Promise<string> {
  const url = `${BASE_URL}/words/hint`;
  const { hint } = await fetch(url).then((res) => res.json());
  return hint;
}

export async function getOpenedWords(): Promise<Word[]> {
  const url = `${BASE_URL}/words/opened`;
  const response = await fetch(url).then((res) => res.json());
  return response.map((item: Partial<Word>) => ({ ...item, guessed: false }));
}
