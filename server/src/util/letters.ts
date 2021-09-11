import { create, lookup, Trie } from "@remusao/trie";
import fs from "fs";

type Props = {
  words: Set<string>;
  characters: string;
};

const data = fs.readFileSync("./src/util/dict.txt", "utf8").split("\n");

const trie = create(data);


export const populateSet = (props: string): Array<string> => {

  const words = new Set<string>();

  const permuteWords = (
    wordBank: string,
    currWord: string,
    wordList: Set<string>,
    trie: Trie
  ) => {
    if (lookup(trie, currWord)) {
      wordList.add(currWord);
    }

    for (const letter of wordBank) {
      permuteWords(
        wordBank.replace(letter, ""),
        currWord + letter,
        wordList,
        trie
      );
    }
  };

  permuteWords(props, "", words, trie);
  const wordList = Array.from(words);
  wordList.sort(function (a, b) {
    return b.length - a.length;
  });

  return wordList;
};