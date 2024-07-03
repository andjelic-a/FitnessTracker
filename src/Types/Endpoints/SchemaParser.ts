import { LastElement, Split } from "../Utility/StringLiteralsUtility";
import { AllSchemaInformation, SchemaNames } from "./Endpoints";
import { IsPropertyNullable, ParseSchemaProperty } from "./PropertyParser";

export type Schema<SchemaName extends SchemaNames> = ParseSchema<
  SchemaInfo<SchemaName>
>;

export type SchemaFromString<SchemaName extends string> =
  SchemaName extends SchemaNames ? ParseSchema<SchemaInfo<SchemaName>> : never;

export type SchemaInfo<T extends SchemaNames> = AllSchemaInformation[T];

export type ParseSchema<T extends SchemaInfo<SchemaNames>> =
  "enum" extends keyof T
    ? T["enum"] extends [any, ...any[]]
      ? T["enum"][number]
      : never
    : "type" extends keyof T
    ? T["type"] extends "object"
      ? ParseSchemaObject<T>
      : never
    : never;

type ParseSchemaObject<T extends SchemaInfo<SchemaNames>> =
  "properties" extends keyof T
    ? {
        [P in keyof T["properties"]]:
          | ParseSchemaProperty<T["properties"][P]>
          | IsPropertyNullable<T["properties"][P]>;
      }
    : never;

export type RefToSchemaName<Ref extends string> = LastElement<
  Split<Ref, "/">
>;
