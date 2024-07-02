/* export type Include<T extends {}> = {
  [P in keyof T as T[P] extends any[] ? P : never]: T[P];
};
 */
export type Narrow<
  OriginalEntity extends {},
  KeysToNarrow extends
    | keyof OriginalEntity
    | (keyof OriginalEntity)[]
    | "none"
    | "all"
    | undefined
    | null
    | void
> = KeysToNarrow extends "none" | undefined | null | void
  ? {}
  : KeysToNarrow extends "all"
  ? OriginalEntity
  : KeysToNarrow extends (keyof OriginalEntity)[]
  ? {
      [K in KeysToNarrow[number]]: OriginalEntity[K];
    }
  : KeysToNarrow extends keyof OriginalEntity
  ? Narrow<OriginalEntity, [KeysToNarrow]>
  : never;

export type Immutable<T> = {
  readonly [P in keyof T]: T[P];
};
