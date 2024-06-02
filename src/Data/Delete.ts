import { Guid } from "../Types/Models/IModel";
import { getAuthorizationHeader } from "./User";

const baseAPIUrl = "http://localhost:5054/api";

export async function deleteEntity(apiEndpoint: string, id: number | Guid) {
  return fetch(`${baseAPIUrl}/${apiEndpoint}/${id}`, {
    method: "Delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getAuthorizationHeader()) as string,
    },
  }).catch((err) => console.error(err));
}
