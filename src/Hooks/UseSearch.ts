import { useMemo } from "react";
import distance from "../Utility/DamerauLevenshteinDistance";
import { Trie } from "../Utility/Trie";

export default function useSearch<T>(
  data: T[],
  nameSelector: (item: T) => string
) {
  const possibleWords = useMemo(
    () => data.map(nameSelector),
    [data, nameSelector]
  );
  const trie = useMemo(() => Trie.from(possibleWords), [possibleWords]);

  function sortByDistance(words: string[], query: string) {
    const priorityWords: { word: string; priority: number }[] = words.map(
      (x) => ({
        word: x,
        priority: distance(x, query),
      })
    );

    const sortedPriorityWords = priorityWords.sort(
      (a, b) => a.priority - b.priority
    );

    const distanceBasedSuggestions = sortedPriorityWords.map((x) => x.word);

    return distanceBasedSuggestions;
  }

  function createAutoCompleteResults(query: string, take: number): T[] | null {
    if (query === "") return null;

    const enteredQuery = query.toLowerCase();

    const trieSuggestions = trie.suggest(enteredQuery);
    const distanceBasedSuggestions = sortByDistance(
      possibleWords,
      enteredQuery
    );

    const suggestionsTemplate = [
      ...new Set([
        ...trieSuggestions,
        ...distanceBasedSuggestions.map((x) => x.toLowerCase()),
      ]),
    ];

    let suggestions = sortByTemplate(data, suggestionsTemplate, nameSelector);
    if (take >= 0) suggestions = suggestions.slice(0, take);

    return suggestions;
  }

  function sortByTemplate<T>(
    data: T[],
    template: string[],
    selector: (x: T) => string
  ): T[] {
    // Create a map from the template for quick lookup
    const templateOrder = new Map<string, number>();
    template.forEach((value, index) => {
      templateOrder.set(value, index);
    });

    // Sort the data array based on the template order
    return data.sort((a, b) => {
      const aKey = selector(a).toLowerCase();
      const bKey = selector(b).toLowerCase();
      const aIndex = templateOrder.get(aKey);
      const bIndex = templateOrder.get(bKey);

      if (aIndex === undefined || bIndex === undefined) {
        return 0; // If the key is not in the template, consider them equal
      }

      return aIndex - bIndex;
    });
  }

  return (query: string, take?: number) => {
    const suggestions = createAutoCompleteResults(query, take ?? -1) ?? data;
    return take ? suggestions : suggestions;
  };
}
