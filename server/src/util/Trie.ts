import { create, lookup, Trie } from "@remusao/trie";
import fs from "fs";

type Props = {
  words: Set<string>;
  characters: string;
};

const props: Props = {
  words: new Set(),
  characters: "NFIOISSOD".toLowerCase(),
};

const data = fs.readFileSync("./src/util/dict.txt", "utf8").split("\n");

const trie = create(data);

const populateSet = (props: Props) => {
  // const trie = new TrieSearch('name', { min: 1 });

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

  permuteWords(props.characters, "", props.words, trie);
};

populateSet(props);
const wordList = Array.from(props.words);
wordList.sort(function (a, b) {
  return b.length - a.length;
});
console.log(wordList);
