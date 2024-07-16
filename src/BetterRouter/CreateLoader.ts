import { defer, LoaderFunctionArgs } from "react-router-dom";
import { LoaderParams, Routes } from "./Routes";
import sendAPIRequest from "../Data/SendAPIRequest";

export type Loader<
  Route extends Routes,
  T extends { [key: string]: any }
> = (args: { params: LoaderParams<Route>; request: Request }) => T | null;

export type LoaderReturnType<C extends Loader<any, any>> = C extends Loader<
  any,
  infer T
>
  ? T
  : unknown;

export default function createLoader<
  Route extends Routes,
  T extends { [key: string]: any }
>(route: Route, loader: Loader<Route, T>) {
  return (x: LoaderFunctionArgs) => {
    try {
      const data: T | null = loader({
        params: x.params as LoaderParams<Route>,
        request: x.request,
      });

      return !data || data instanceof Response
        ? data
        : (defer(data) as unknown as T);
    } catch (error) {
      console.log(`Error occurred in loader on route ${route}.`, error);
      throw error;
    }
  };
}

export const a = createLoader("/exercises/:exerciseId", ({ params }) => {
  return {
    exercises: sendAPIRequest("/api/exercise/{id}/detailed", {
      method: "get",
      parameters: { id: +params.exerciseId! },
    }),
  };
});
