import { useLoaderData as useLoaderDataUnsafe } from "react-router-dom";
import { LoaderReturnType, Loader as LoaderType } from "./CreateLoader";

export default function useLoaderData<
  Loader extends LoaderType<any>
>(): Awaited<LoaderReturnType<Loader>> {
  const data = useLoaderDataUnsafe();
  return data as Awaited<LoaderReturnType<Loader>>;
}
