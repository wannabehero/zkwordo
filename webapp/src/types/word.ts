export interface Word {
  id: number;
  word: string;
  hint: string;
  guessed: boolean | undefined;
}
