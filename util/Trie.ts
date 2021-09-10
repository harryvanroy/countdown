class TrieNode {
  key: string;
  parent: TrieNode;
  children: Object;
  end: boolean;

  constructor(key: string) {
    this.key = key
    this.parent = null
    this.children = {}
    this.end = false
  }

  getWord() {
    const output = [];
    let node: TrieNode = this;

    while (node !== null) {
      output.unshift(node.key)
      node = node.parent
    }

    return output.join('')
  }
}

class Trie {
  root: TrieNode

  constructor() {
    this.root = new TrieNode(null)
  }

  insert(word) {
    let node = this.root;

    for (let i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) {
        node.children[word[i]] = new TrieNode(word[i])
        node.children[word[i]].parent = node
      }

      node = node.children[word[i]]

      if (i === word.length - 1) {
        node.end = true
      }
    }
  }

  contains(word) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (node.children[word[i]]) {
        node = node.children[word[i]]
      } else {
        return false
      }
    }
    return node.end
  }

  find(prefix) {
    let node = this.root;
    const output = [];
    for (let i = 0; i < prefix.length; i++) {
      if (node.children[prefix[i]]) {
        node = node.children[prefix[i]]
      } else {
        return output
      }
    }

    findAllWords(node, output)
    return output
  }
}

function findAllWords(node, arr) {
  if (node.end) {
    arr.unshift(node.getWord())
  }

  for (const child in node.children) {
    findAllWords(node.children[child], arr)
  }
}

export default Trie;


// usage
var trie = new Trie();
// insert values
trie.insert("hello");
trie.insert("helium");
// check contains method
console.log(trie.contains("helium")); // true
console.log(trie.contains("kickass")); // false
// check find method
console.log(trie.find("hel")); // [ 'helium', 'hello' ]
console.log(trie.find("hell")); // [ 'hello' ]

import { readFileSync } from 'fs';

const file = readFileSync('./dict.txt', 'utf-8');
console.log(file);