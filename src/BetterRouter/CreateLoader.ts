import { defer, LoaderFunctionArgs } from "react-router-dom";
import { LoaderParams, Routes } from "./Routes";
import sendAPIRequest from "../Data/SendAPIRequest";

export type LoaderInit<
  Route extends Routes,
  T extends { [key: string]: any }
> = (args: {
  params: LoaderParams<Route>;
  request: Request;
}) => LoaderInitData<T> | Promise<LoaderInitData<T>>;

type LoaderInitData<T> =
  | (T extends ReturnType<typeof defer>
      ? never
      : T extends Promise<any>
      ? never
      : T)
  | Response
  | null;

export type Loader<T> = (x: LoaderFunctionArgs) => Promise<T | Response | null>;

export type LoaderReturnType<C extends Loader<any>> = C extends Loader<infer T>
  ? T
  : unknown;

export default function createLoader<
  Route extends Routes,
  T extends { [key: string]: any }
>(route: Route, loader: LoaderInit<Route, T>): Loader<T> {
  return async (x: LoaderFunctionArgs) => {
    try {
      const data: T | Response | null = await loader({
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
