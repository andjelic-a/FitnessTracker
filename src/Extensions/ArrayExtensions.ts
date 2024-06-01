export {};

declare global {
  interface Array<T> {
    removeDuplicates(): T[];
  }
}

Array.prototype.removeDuplicates = function <T>(): T[] {
  return Array.from(new Set(this));
};
