import { MappedEndpoints } from "./Endpoints";
import { Union2Tuple } from "./Union2Tuple";

type Paths = MappedEndpoints["paths"];

type Endpoints = keyof Paths;

type Methods<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends keyof Paths
    ?
        | {
            endpoint: First;
            request: Request<First, Union2Tuple<keyof Paths[First]>>;
          }
        | Methods<Rest>
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
> = "requestBody" extends keyof Paths[Path][Method] ? { payload: true } : {};

export type Test = Methods<Union2Tuple<Endpoints>>;

export const t: Test = {
  endpoint: "/api/equipment",
  request: {
    method: "get",
    a: "tags",
    parameters: true,
  },
};
