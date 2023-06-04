import { useEffect, useState } from "react";
import { getTodayHint } from "../api";

const useHint = () => {
  const [hint, setHint] = useState<string>();

  useEffect(() => {
    getTodayHint()
      .then((hint) => setHint(hint));
  }, [setHint]);

  return hint;
}

export default useHint;
