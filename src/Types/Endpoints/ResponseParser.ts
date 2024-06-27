import { MappedEndpoints } from "./Endpoints";
import { APIRequest } from "./RequestParser";

type Paths = MappedEndpoints["paths"];
type Endpoints = keyof Paths;

export type APIResponse<Request extends APIRequest> = Request extends {
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
  ? {
      [Key in keyof Responses as Responses[Key] extends {
        description: infer Description;
      }
        ? Description extends string
          ? Description
          : never
        : never]: Key;
    }
  : never;

export type Test = Response<"/api/muscle", "get">;
