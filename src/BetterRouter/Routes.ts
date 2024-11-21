import { LoaderFunctionArgs, ParamParseKey, Params } from "react-router-dom";

interface LoaderArgsInterface<Route extends string> extends LoaderFunctionArgs {
  params: Params<ParamParseKey<Route>>;
}

type LoaderArguments<Route extends string> = LoaderArgsInterface<Route>;

export type LoaderParams<Route extends string> =
  LoaderArguments<Route>["params"];
