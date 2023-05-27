import Today from '../components/Today';
import Words from '../components/Words';
import { useZkWordoGuessPrice } from '../web3/contracts';

const TodayScreen = () => {
  const { data: price } = useZkWordoGuessPrice();

  return (
    <>
      <Today
        currency="MATIC"
        day={0}
        hint="Hard word to guess"
        price={price ?? BigInt(0)}
        onGuess={(word) => {
          alert(word);
          return Promise.resolve(true);
        }}
        isLoading={false}
      />
      <Words
        words={[
          { id: 0, word: 'word1', guessed: true },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
          { id: 1, word: 'word2', guessed: false },
        ]}
      />
    </>
  );
}

export default TodayScreen;
