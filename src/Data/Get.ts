import IModel from "../Types/Models/IModel";
import { IncludeKeys } from "../Types/Utility/Models";
import { baseAPIUrl } from "./BaseURLs";

export default async function get<T extends IModel>(
  apiEndpoint: string,
  include?: IncludeKeys<T> | IncludeKeys<T>[] | "none" | "all",
  q?: string | string[] | Promise<string | string[]>,
  limit: number = 10,
  offset: number = 0
): Promise<T[]> {
  q = await q;
  const queryString = !q ? undefined : Array.isArray(q) ? q.join(";") : q;
  return fetch(
    `${baseAPIUrl}/${apiEndpoint}?include=${getIncludeString(include)}&${
      queryString ? `q=${queryString}` : ""
    }&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    }
  ).then((result) => result.json()) as Promise<T[]>;
}

export async function getOne<T extends IModel>(
  apiEndpoint: string,
  id: string,
  include?: IncludeKeys<T> | IncludeKeys<T>[] | "none" | "all"
): Promise<T> {
  return fetch(
    `${baseAPIUrl}/${apiEndpoint}/${id}?include=${getIncludeString(include)}`,
    {
      method: "GET",
    }
  ).then((result) => result.json());
}

function getIncludeString<T extends IModel>(
  include?: IncludeKeys<T> | IncludeKeys<T>[] | "none" | "all"
) {
  return !include || include === "none"
    ? "none"
    : Array.isArray(include)
    ? include.join(",")
    : include;
}
