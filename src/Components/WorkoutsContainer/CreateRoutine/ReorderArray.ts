export default function reorderArray<T>(
  array: T[],
  from: number,
  to: number
): T[] {
  console.log(array);

  const newArray: T[] = [];

  if (from < to) {
    newArray.push(...array.slice(0, from));
    newArray.push(...array.slice(from + 1, to + 1));
    newArray.push(array[from]);
    newArray.push(...array.slice(to + 1));
  } else {
    newArray.push(...array.slice(0, to));
    newArray.push(array[from]);
    newArray.push(...array.slice(to, from));
    newArray.push(...array.slice(from + 1));
  }

  return newArray;
}
