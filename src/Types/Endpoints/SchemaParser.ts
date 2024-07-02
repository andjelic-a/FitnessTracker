import { LastElement, Split } from "../Utility/StringLiteralsUtility";
import { MappedEndpoints } from "./Endpoints";
import { IsPropertyNullable, ParseSchemaProperty } from "./PropertyParser";

export type Schema<SchemaName extends SchemaNames> = ParseSchema<
  SchemaInfo<SchemaName>
>;

export type SchemaFromString<SchemaName extends string> =
  SchemaName extends SchemaNames ? ParseSchema<SchemaInfo<SchemaName>> : never;

type SchemaInfos = MappedEndpoints["components"]["schemas"];
type SchemaNames = keyof SchemaInfos;

export type SchemaInfo<T extends SchemaNames> = SchemaInfos[T];

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

export type GetSchemaNameFromRequestBody<RequestBody> = LastElement<
  Split<GetFullSchemaName<RequestBody>, "/">
>;

export type GetSchemaName<FullSchemaName extends string> = LastElement<
  Split<FullSchemaName, "/">
>;

export type GetFullSchemaName<RequestBody> = "content" extends keyof RequestBody
  ? "application/json" extends keyof RequestBody["content"]
    ? "schema" extends keyof RequestBody["content"]["application/json"]
      ? "$ref" extends keyof RequestBody["content"]["application/json"]["schema"]
        ? RequestBody["content"]["application/json"]["schema"]["$ref"] extends string
          ? RequestBody["content"]["application/json"]["schema"]["$ref"]
          : ""
        : ""
      : ""
    : ""
  : "";

/* export type GetFullSchemaName<RequestBody> = RequestBody extends {
  content: {
    "application/json": {
      schema: {
        $ref: infer SchemaName;
      };
    };
  };
}
  ? SchemaName extends string
    ? "SchemaName"
    : ""
  : ""; */
