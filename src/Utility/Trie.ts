class TrieNode {
  children: { [key: string]: TrieNode };
  isWord: boolean;

  constructor() {
    this.children = {};
    this.isWord = false;
  }
}

export class Trie {
  root: TrieNode;
  private constructor() {
    this.root = new TrieNode();
  }

  static empty() {
    return new Trie();
  }

  static from(words: string[]) {
    const trie = new Trie();
    words.forEach((word) => trie.insert(word.toLowerCase()));
    return trie;
  }

  insert(word: string) {
    let node = this.root;
    for (let i = 0; i < word.length; i++) {
      if (!node.children[word[i]]) {
        node.children[word[i]] = new TrieNode();
      }
      node = node.children[word[i]];
    }
    node.isWord = true;
  }

  private suggestHelper(root: TrieNode, list: string[], curr: string) {
    if (root.isWord) {
      list.push(curr);
    }
    if (!Object.keys(root.children).length) {
      return;
    }
    for (let child in root.children) {
      this.suggestHelper(root.children[child], list, curr + child);
    }
  }

  suggest(prefix: string) {
    prefix = prefix.toLowerCase();
    let node = this.root;
    let curr = "";

    for (let i = 0; i < prefix.length; i++) {
      if (!node.children[prefix[i]]) {
        return [];
      }
      node = node.children[prefix[i]];
      curr += prefix[i];
    }

    let list: string[] = [];
    this.suggestHelper(node, list, curr);
    return list;
  }
}
