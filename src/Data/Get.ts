import IModel from "../Types/Models/IModel";
import { IncludeKeys, Query } from "../Types/Utility/Models";

const BaseAPIUrl = "http://192.168.1.100:5054/api";

export default async function Get<T extends IModel>(
  apiEndpoint: string,
  include?: IncludeKeys<T> | IncludeKeys<T>[] | "none" | "all",
  q?: Query<T> | Query<T>[],
  limit: number = 10,
  offset: number = 0
): Promise<T[]> {
  const queryString = !q ? undefined : Array.isArray(q) ? q.join(";") : q;
  const includeString =
    !include || include === "none"
      ? "none"
      : Array.isArray(include)
      ? include.join(",")
      : include;

  return fetch(
    `${BaseAPIUrl}/${apiEndpoint}?include=${includeString}&${
      queryString ? queryString : ""
    }&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    }
  ).then((result) => result.json()) as Promise<T[]>;
}

export async function GetOne<T extends IModel>(
  apiEndpoint: string,
  id: string
): Promise<T> {
  return fetch(`${BaseAPIUrl}/${apiEndpoint}/${id}`, {
    method: "GET",
  }).then((result) => result.json());
}
