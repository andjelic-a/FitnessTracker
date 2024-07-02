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

export type Join<
  T extends string[],
  Connector extends string = " "
> = T extends [infer L, ...infer R]
  ? R extends []
    ? L
    : R extends string[]
    ? L extends string
      ? `${L}${Connector}${Join<R, Connector>}`
      : Join<R, Connector>
    : L
  : "";

export type RemoveEmpty<T extends string[]> = T extends [infer L, ...infer R]
  ? L extends ""
    ? R extends string[]
      ? RemoveEmpty<R>
      : []
    : [L, ...(R extends string[] ? RemoveEmpty<R> : [])]
  : [];
