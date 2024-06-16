import { Guid } from "../Types/Models/IModel";
import { baseAPIUrl } from "./BaseURLs";
import { getBearerToken } from "./User";

export async function deleteEntity(apiEndpoint: string, id: number | Guid) {
  return fetch(`${baseAPIUrl}/${apiEndpoint}/${id}`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getBearerToken()) as string,
    },
  }).catch((err) => console.error(err));
}
