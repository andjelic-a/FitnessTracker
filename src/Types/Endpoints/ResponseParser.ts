import { Endpoints, Methods, Paths } from "./Endpoints";
import { Union2Tuple } from "./Union2Tuple";
import { ParseSchemaProperty } from "./PropertyParser";

export type APIResponse<
  Endpoint extends Endpoints,
  Method extends Methods<Endpoint>
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
