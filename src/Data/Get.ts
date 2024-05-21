import IModel from "../Types/Models/IModel";

// type a = Join<RemoveEmpty<Split<"a b c d", "b">>>;

export type Narrow<
  OriginalEntity extends IModel,
  KeysToNarrow extends
    | keyof OriginalEntity
    | (keyof OriginalEntity)[]
    | "none"
    | "all"
    | undefined
    | null
    | void
> = KeysToNarrow extends "none" | undefined | null | void
  ? {}
  : KeysToNarrow extends "all"
  ? OriginalEntity
  : KeysToNarrow extends (keyof OriginalEntity)[]
  ? {
      [K in KeysToNarrow[number]]: OriginalEntity[K];
    }
  : KeysToNarrow extends keyof OriginalEntity
  ? Narrow<OriginalEntity, [KeysToNarrow]>
  : never;

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
  const queryString = !q ? undefined : Array.isArray(q) ? q.join(";") : q;
  const includeString =
    !include || include === "none"
      ? "none"
      : Array.isArray(include)
      ? include.join(",")
      : include;

  const result = await fetch(
    `${BaseAPIUrl}/${apiEndpoint}?include=${includeString}&${
      queryString ? queryString : ""
    }&limit=${limit}&offset=${offset}`,
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
