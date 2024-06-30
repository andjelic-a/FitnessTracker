import { APIRequest } from "../Types/Endpoints/RequestParser";
import { APIResponseFromRequest } from "../Types/Endpoints/ResponseParser";
import { getBearerToken } from "./User";

const baseAPIUrl = "http://localhost:5054";

export default async function sendAPIRequest<T extends APIRequest>(
  request: T,
  authorize: true | `Bearer ${string}` | null = true
): Promise<APIResponseFromRequest<T>> {
  const url = new URL(baseAPIUrl + request.endpoint);

  if ("parameters" in request.request) {
    Object.keys(request.request.parameters).forEach((key) => {
      if (
        !("parameters" in request.request) ||
        typeof request.request.parameters !== "object"
      )
        return;
      if (!url.href.includes("%7B" + key + "%7D")) return;

      url.href = url.href.replace(
        "%7B" + key + "%7D",
        (request.request.parameters as Record<string, string>)[key]
      );

      delete (request.request.parameters as Record<string, string>)[key];
    });

    url.search = new URLSearchParams(
      request.request.parameters as Record<string, string>
    ).toString();
  }

  const body =
    "payload" in request.request
      ? JSON.stringify(request.request.payload)
      : null;

  let requestInit: RequestInit = {
    method: request.request.method,
    body: body,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        authorize === null
          ? ""
          : authorize === true
          ? ((await getBearerToken()) as string)
          : (authorize as string),
    },
  };

  console.log(requestInit);

  const response = await fetch(url, requestInit);
  try {
    const responseBody = await response.json();

    return {
      code: response.statusText,
      content: responseBody,
    } as any;
  } catch (error) {
    return {
      code: response.statusText,
      content: null,
    } as any;
  }
}
