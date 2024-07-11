export function toTitleCase(text: string) {
  return text
    .split(" ")
    .map((word) => {
      if (word.length === 0) return word;

      return (
        word.charAt(0).toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
      );
    })
    .join(" ");
}
