"use strict";
exports.__esModule = true;
var TrieNode = /** @class */ (function () {
    function TrieNode(key) {
        this.key = key;
        this.parent = null;
        this.children = {};
        this.end = false;
    }
    TrieNode.prototype.getWord = function () {
        var output = [];
        var node = this;
        while (node !== null) {
            output.unshift(node.key);
            node = node.parent;
        }
        return output.join('');
    };
    return TrieNode;
}());
var Trie = /** @class */ (function () {
    function Trie() {
        this.root = new TrieNode(null);
    }
    Trie.prototype.insert = function (word) {
        var node = this.root;
        for (var i = 0; i < word.length; i++) {
            if (!node.children[word[i]]) {
                node.children[word[i]] = new TrieNode(word[i]);
                node.children[word[i]].parent = node;
            }
            node = node.children[word[i]];
            if (i === word.length - 1) {
                node.end = true;
            }
        }
    };
    Trie.prototype.contains = function (word) {
        var node = this.root;
        for (var i = 0; i < word.length; i++) {
            if (node.children[word[i]]) {
                node = node.children[word[i]];
            }
            else {
                return false;
            }
        }
        return node.end;
    };
    Trie.prototype.find = function (prefix) {
        var node = this.root;
        var output = [];
        for (var i = 0; i < prefix.length; i++) {
            if (node.children[prefix[i]]) {
                node = node.children[prefix[i]];
            }
            else {
                return output;
            }
        }
        findAllWords(node, output);
        return output;
    };
    return Trie;
}());
function findAllWords(node, arr) {
    if (node.end) {
        arr.unshift(node.getWord());
    }
    for (var child in node.children) {
        findAllWords(node.children[child], arr);
    }
}
exports["default"] = Trie;
// usage
var trie = new Trie();

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: fs.createReadStream('dict.txt'),
    crlfDelay: Infinity
});

rl.on('line', (line) => {
    if (line.length <= 9) {
        // console.log(line)
        trie.insert(line)
    }
});

console.log(trie.contains("zymurgy")); // true
console.log(trie.contains("potato")); // false
// check find method
console.log(trie.find("hel")); // [ 'helium', 'hello' ]
console.log(trie.find("hell")); // [ 'hello' ]
// var file = (0, fs_1.readFileSync)('./dict.txt', 'utf-8');
// console.log(file);
