import {
  LastElement,
  RemoveEmpty,
  Split,
} from "../Utility/StringLiteralsUtility";
import { MappedEndpoints } from "./Endpoints";
import { Union2Tuple } from "./Union2Tuple";

type Paths = MappedEndpoints["paths"];

type Endpoints = keyof Paths;

type APIRequest<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends keyof Paths
    ?
        | {
            endpoint: First;
            request: Request<First, Union2Tuple<keyof Paths[First]>>;
          }
        | APIRequest<Rest>
    : never
  : never;

type Request<Path extends keyof Paths, T extends any[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends keyof Paths[Path]
    ?
        | ({
            method: First;
            a: keyof Paths[Path][First];
          } & Parameters<Path, First> &
            Payload<Path, First>)
        | Request<Path, Rest>
    : never
  : never;

type Parameters<
  Path extends keyof Paths,
  Method extends keyof Paths[Path]
> = "parameters" extends keyof Paths[Path][Method] ? { parameters: true } : {};

type Payload<
  Path extends keyof Paths,
  Method extends keyof Paths[Path]
> = "requestBody" extends keyof Paths[Path][Method]
  ? {
      payload: LastElement<RemoveEmpty<
        Split<GetSchemaForEndpoint<Paths[Path][Method]["requestBody"]>, "/">
      >>;
    }
  : {};

type GetSchemaForEndpoint<RequestBody> = "content" extends keyof RequestBody
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

export type Test = APIRequest<Union2Tuple<Endpoints>>;

export const t: Test = {
  endpoint: "/api/equipment",
  request: {
    method: "post",
    a: "tags",
    payload: "CreateEquipmentRequestDTO",
  },
};

type Components = MappedEndpoints["components"];
type Schemas = Components["schemas"];
type SchemaNames = keyof Schemas;

type Schema<T extends SchemaNames> = Schemas[T];

type ParseSchema<T extends Schema<SchemaNames>> = "type" extends keyof T
  ? T["type"] extends "object"
    ? ParseSchemaObject<T>
    : never
  : never;

type ParseSchemaObject<T extends Schema<SchemaNames>> =
  "properties" extends keyof T
    ? {
        [P in keyof T["properties"]]: ParseSchemaProperty<T["properties"][P]>;
      }
    : never;

type ParseSchemaProperty<T> = "type" extends keyof T ? T["type"] : never;

export type SchemaTest = ParseSchema<Schema<"CreateExerciseRequestDTO">>;
