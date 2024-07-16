import { LoaderFunctionArgs, ParamParseKey, Params } from "react-router-dom";
import { RoutePathObjects } from "../main";

export type Routes = UnwrappedRoutes<RoutePathObjects>;

interface LoaderArgsInterface<Route extends Routes> extends LoaderFunctionArgs {
  params: Params<ParamParseKey<Route>>;
}

type LoaderArguments<Route extends Routes> = LoaderArgsInterface<Route>;

export type LoaderParams<Route extends Routes> =
  LoaderArguments<Route>["params"];

type UnwrappedRoutes<RouteObjects> = RouteObjects extends readonly [
  infer First,
  ...infer Rest
]
  ?
      | (First extends {
          path: infer Path;
        }
          ? Path | ParseChildRoutes<First, Path>
          : never)
      | UnwrappedRoutes<Rest>
  : never;

type ParseChildRoutes<RouteObject, Path> = RouteObject extends {
  children: infer Children;
}
  ? ConnectRoutes<UnwrappedRoutes<Children>, Path>
  : never;

type ConnectRoutes<UnwrappedChildRoutes, ParentRoute> =
  UnwrappedChildRoutes extends string
    ? ParentRoute extends string
      ? `${RemoveTrailingSlash<ParentRoute>}/${RemoveTrailingSlash<UnwrappedChildRoutes>}`
      : never
    : never;

type RemoveTrailingSlash<T extends string> = RemoveStartingSlash<
  RemoveEndingSlash<T>
>;

type RemoveStartingSlash<T extends string> = T extends `/${infer R}`
  ? R extends `/${infer S}`
    ? RemoveStartingSlash<S>
    : R
  : T;

type RemoveEndingSlash<T extends string> = T extends `${infer R}/`
  ? R extends `${infer S}/`
    ? RemoveEndingSlash<S>
    : R
  : T;
