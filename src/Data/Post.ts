import IModel from "../Types/Models/IModel";
import { baseAPIUrl } from "./BaseURLs";
import { getBearerToken } from "./User";

export async function post<T extends IModel>(apiEndpoint: string, data: T) {
  return fetch(`${baseAPIUrl}/${apiEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getBearerToken()) as string,
    },
    body: JSON.stringify(data),
  }).catch((err) => console.error(err));
}
