import IModel from "../Types/Models/IModel";

const BaseAPIUrl = "http://192.168.1.100:5054/api";

type Include<T extends IModel> = {
  [P in keyof T as T[P] extends any[] ? P : never]: T[P];
};

type IncludeKeys<T extends IModel> = keyof Include<T>;

type Query<T extends IModel> = `${keyof Include<T>}=${string}`;

export default async function Get<T extends IModel>(
  apiEndpoint: string,
  include?: IncludeKeys<T> | IncludeKeys<T>[] | "none" | "all",
  q?: Query<T> | Query<T>[],
  limit: number = 10,
  offset: number = 0
): Promise<T[]> {
  const includeString = !include
    ? undefined
    : Array.isArray(include)
    ? include.join(",")
    : include;

  const queryString = !q ? undefined : Array.isArray(q) ? q.join(";") : q;

  const result = await fetch(
    `${BaseAPIUrl}/${apiEndpoint}?include=${
      includeString ? includeString : "none"
    }&${queryString ? queryString : ""}&limit=${limit}&offset=${offset}`,
    {
      method: "GET",
    }
  );

  return result.json() as Promise<T[]>;
}

export async function GetOne<T extends IModel>(
  apiEndpoint: string,
  id: string
): Promise<T> {
  const result = await fetch(`${BaseAPIUrl}/${apiEndpoint}/${id}`, {
    method: "GET",
  });

  return result.json() as Promise<T>;
}

export async function GetOneFetchPromise<T extends IModel>(
  apiEndpoint: string,
  id: string
): Promise<T> {
  return fetch(`${BaseAPIUrl}/${apiEndpoint}/${id}`, {
    method: "GET",
  }).then((result) => result.json());
}
