import TrieSearch from 'trie-search';

const trie = new TrieSearch();

trie.map('hello', 'world'); // Map 'hello' to the String 'world'
trie.map('here', 'is a trie search'); // Map 'hello' to the String 'world'

trie.search('he');    // ['world', 'is a trie search]
trie.search('her');   // ['is a trie search]
trie.search('hel');   // ['world']
console.log(trie.search('hello')); // ['world']