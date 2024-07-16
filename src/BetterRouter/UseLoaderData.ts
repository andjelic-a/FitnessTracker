import { useLoaderData } from "react-router-dom";
import { LoaderReturnType, Loader as LoaderType } from "./CreateLoader";

export default function UseLoaderData<
  Loader extends LoaderType<any, any>
>(): LoaderReturnType<Loader> {
  const data = useLoaderData();
  return data as LoaderReturnType<Loader>;
}
