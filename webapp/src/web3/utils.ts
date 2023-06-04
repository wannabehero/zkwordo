import { EXPLORER_TOKEN_URL, ZKWORDO_CONTRACT } from './const';

export function getExplorerTokenURL(id: number) {
  return EXPLORER_TOKEN_URL.replace('{address}', ZKWORDO_CONTRACT).replace('{id}', id.toString());
}
