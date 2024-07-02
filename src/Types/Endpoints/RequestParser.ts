import { MappedEndpoints } from "./Endpoints";
import { ParseParameters } from "./ParametersParser";
import { GetSchemaNameFromRequestBody, SchemaFromString } from "./SchemaParser";
import { Union2Tuple } from "./Union2Tuple";

type Paths = MappedEndpoints["paths"];

type Endpoints = keyof Paths;

type ParseEndpoints<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends keyof Paths
    ?
        | {
            endpoint: First;
            request: Request<First, Union2Tuple<keyof Paths[First]>>;
          }
        | ParseEndpoints<Rest>
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
          } & Parameters<Path, First> &
            Payload<Path, First>)
        | Request<Path, Rest>
    : never
  : never;

type Parameters<
  Path extends keyof Paths,
  Method extends keyof Paths[Path]
> = "parameters" extends keyof Paths[Path][Method]
  ? Paths[Path][Method]["parameters"] extends any[]
    ? {
        parameters: ParseParameters<Paths[Path][Method]["parameters"]>;
      }
    : {}
  : {};

type Payload<
  Path extends keyof Paths,
  Method extends keyof Paths[Path]
> = "requestBody" extends keyof Paths[Path][Method]
  ? {
      payload: SchemaFromString<
        GetSchemaNameFromRequestBody<Paths[Path][Method]["requestBody"]>
      >;
    }
  : {};

export type APIRequest<Endpoint extends Endpoints = Endpoints> = ParseEndpoints<
  Union2Tuple<Endpoint>
>;

/* export const t: APIRequest<"/api/split/comment/{id}/like"> = {
  endpoint: "/api/split/comment/{id}/like",
  request: {
    method: "post",
    parameters: {
      id: "123",
    },
  },
};
 */
