import { Endpoints, Paths } from "./Endpoints";
import { ParseParameters } from "./ParametersParser";
import { GetSchemaName, SchemaFromString } from "./SchemaParser";
import { Union2Tuple } from "./Union2Tuple";

// type ParseEndpoints<T extends any[]> = T extends [infer First, ...infer Rest]
//   ? First extends keyof Paths
//     ?
//         | {
//             endpoint: First;
//             request: RequestHelper<First, Union2Tuple<keyof Paths[First]>>;
//           }
//         | ParseEndpoints<Rest>
//     : never
//   : never;

export type Request<Endpoint extends Endpoints> = RequestHelper<
  Endpoint,
  Union2Tuple<keyof Paths[Endpoint]>
>;

export type RequestHelper<
  Path extends keyof Paths,
  T extends any[]
> = T extends [infer First, ...infer Rest]
  ? First extends keyof Paths[Path]
    ?
        | ({
            method: First;
          } & Parameters<Path, First> &
            Payload<Path, First>)
        | RequestHelper<Path, Rest>
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
> = Paths[Path][Method] extends {
  requestBody: {
    content: {
      "application/json": {
        schema: {
          $ref: infer SchemaName;
        };
      };
    };
  };
}
  ? SchemaName extends string
    ? { payload: SchemaFromString<GetSchemaName<SchemaName>> }
    : {}
  : {};

/* export type APIRequest<Endpoint extends Endpoints = Endpoints> = ParseEndpoints<
  Union2Tuple<Endpoint>
>; */

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
