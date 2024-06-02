import IModel from "../Types/Models/IModel";
import { getAuthorizationHeader } from "./User";

const baseAPIUrl = "http://localhost:5054/api";

export async function put<T extends IModel>(apiEndpoint: string, data: T) {
  console.log(`${baseAPIUrl}/${apiEndpoint}`, JSON.stringify(data));

  return fetch(`${baseAPIUrl}/${apiEndpoint}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getAuthorizationHeader()) as string,
    },
    body: JSON.stringify(data),
  }).catch((err) => console.error(err));
}
