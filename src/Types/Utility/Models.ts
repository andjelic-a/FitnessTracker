import IModel from "../Models/IModel";

export type Include<T extends IModel> = {
  [P in keyof T as T[P] extends any[] ? P : never]: T[P];
};

export type IncludeKeys<T extends IModel> = keyof Include<T>;

export type Query<T extends IModel> = `${keyof Include<T>}=${string}`;

export type Narrow<
  OriginalEntity extends IModel,
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
