import type { GetSchemaName, Schema } from "./SchemaParser";

export type ParseSchemaProperty<T> = "type" extends keyof T
  ? T["type"] extends "integer"
    ? number
    : T["type"] extends "string"
    ? string
    : T["type"] extends "boolean"
    ? boolean
    : T["type"] extends "array"
    ? "items" extends keyof T
      ? (ParseSchemaProperty<T["items"]> | IsPropertyNullable<T["items"]>)[]
      : never
    : never
  : "$ref" extends keyof T
  ? T["$ref"] extends string
    ? Schema<GetSchemaName<T["$ref"]>>
    : never
  : never;

export type IsPropertyNullable<T> = "nullable" extends keyof T
  ? T["nullable"] extends true
    ? null
    : never
  : never;

export type NullableToOptional<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: T[K];
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K];
};
