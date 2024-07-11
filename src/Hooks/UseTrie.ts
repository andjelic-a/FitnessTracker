import { useMemo } from "react";
import { Trie } from "../Utility/Trie";

export default function useTrie<T>(data: T[], mapper: (item: T) => string) {
  return useMemo(() => Trie.from(data.map(mapper)), [data]);
}
