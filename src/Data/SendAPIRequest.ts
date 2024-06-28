import { APIRequest } from "../Types/Endpoints/RequestParser";
import { APIResponse } from "../Types/Endpoints/ResponseParser";
import { getBearerToken } from "./User";

const baseAPIUrl = "http://localhost:5054";

export default async function sendAPIRequest<T extends APIRequest>(
  request: T
): Promise<APIResponse<T>> {
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
    "body" in request.request ? JSON.stringify(request.request.body) : null;

  let requestInit: RequestInit = {
    method: request.request.method,
    body,
    headers: {
      "Content-Type": "application/json",
      Authorization: (await getBearerToken()) as string,
    },
  };

  const response = await fetch(url, requestInit);
  try {
    const responseBody = await response.json();

    console.log(response.statusText);
    console.log(responseBody);

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
/* 
const response = await sendAPIRequest({
  endpoint: "/api/muscle",
  request: {
    method: "get",
    parameters: {},
  },
});

if (response.code === "OK") {
  response.content.map((x) => console.log(x));
}
 */
