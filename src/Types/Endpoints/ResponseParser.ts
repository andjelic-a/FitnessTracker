import { MappedEndpoints } from "./Endpoints";
import { APIRequest } from "./RequestParser";
import { Union2Tuple } from "./Union2Tuple";
import { ParseSchemaProperty } from "./PropertyParser";

type Paths = MappedEndpoints["paths"];
type Endpoints = keyof Paths;

export type APIResponseFromRequest<Request extends APIRequest> = Request extends {
  endpoint: infer Endpoint;
  request: { method: infer Method };
}
  ? Endpoint extends Endpoints
    ? Method extends keyof Paths[Endpoint]
      ? Response<Endpoint, Method>
      : never
    : never
  : never;

type Response<
  Endpoint extends Endpoints,
  Method extends keyof Paths[Endpoint]
> = Paths[Endpoint][Method] extends {
  responses: infer Responses;
}
  ? ParseAllResponses<Union2Tuple<Responses[keyof Responses]>>
  : never;

type ParseAllResponses<Responses extends any[]> = Responses extends [
  infer First,
  ...infer Rest
]
  ?
      | (First extends {
          description: infer Description;
          content: {
            "application/json": {
              schema: infer Schema;
            };
          };
        }
          ? {
              code: Description;
              content: ParseSchemaProperty<Schema>;
            }
          : First extends {
              description: infer Description;
            }
          ? { code: Description }
          : never)
      | ParseAllResponses<Rest>
  : never;
