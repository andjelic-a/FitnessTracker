import IModel from "../Types/Models/IModel";
import { getAuthorizationHeader } from "./User";

const baseAPIUrl = "http://localhost:5054/api";

export async function post<T extends IModel>(apiEndpoint: string, data: T) {
  console.log(`${baseAPIUrl}/${apiEndpoint}`, JSON.stringify(data));

  return fetch(`${baseAPIUrl}/${apiEndpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getAuthorizationHeader()) as string,
    },
    body: JSON.stringify(data),
  })
    .then((result) => result.json())
    .catch((err) => console.error(err));
}
