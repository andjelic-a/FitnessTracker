import IModel from "../Types/Models/IModel";
import { getBearerToken } from "./User";

const baseAPIUrl = "http://localhost:5054/api";

export async function put<T extends IModel>(apiEndpoint: string, data: T) {
  return fetch(`${baseAPIUrl}/${apiEndpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getBearerToken()) as string,
    },
    body: JSON.stringify(data),
  }).catch((err) => console.error(err));
}
