export type Split<
  T extends string,
  Separator extends string = " "
> = T extends `${infer L}${Separator}${infer R}`
  ? [...Split<L, Separator>, ...Split<R, Separator>]
  : [T];

export type LastElement<T extends string[]> = T extends [infer L, ...infer R]
  ? R extends [string, ...string[]]
    ? LastElement<R>
    : L
  : never;
