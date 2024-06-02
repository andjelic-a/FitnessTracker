import IModel from "../Types/Models/IModel";
import { getAuthorizationHeader } from "./User";

const baseAPIUrl = "http://localhost:5054/api";

export async function post<T extends IModel>(apiEndpoint: string, data: T) {
  return fetch(`${baseAPIUrl}/${apiEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getAuthorizationHeader()) as string,
    },
    body: JSON.stringify(data),
  }).catch((err) => console.error(err));
}
