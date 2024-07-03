import { Endpoints, Paths } from "./Endpoints";
import { ParseParameters } from "./ParametersParser";
import { RefToSchemaName, SchemaFromString } from "./SchemaParser";
import { Union2Tuple } from "./Union2Tuple";

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
    ? { payload: SchemaFromString<RefToSchemaName<SchemaName>> }
    : {}
  : {};
