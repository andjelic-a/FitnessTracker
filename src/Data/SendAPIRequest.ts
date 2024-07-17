import { Endpoints, Methods } from "../Types/Endpoints/Endpoints";
import { Request } from "../Types/Endpoints/RequestParser";
import { APIResponse } from "../Types/Endpoints/ResponseParser";
import { getJWT } from "./User";

const baseAPIUrl = "http://localhost:5054";

type Response<
  Endpoint extends Endpoints,
  T extends Request<Endpoint>
> = T extends {
  method: infer Method;
}
  ? Method extends Methods<Endpoint>
    ? APIResponse<Endpoint, Method>
    : never
  : never;

export default async function sendAPIRequest<
  T extends Request<Endpoint>,
  Endpoint extends Endpoints
>(
  endpoint: Endpoint,
  request: T,
  authorize: true | string | null = true,
  includeCredentials: boolean = false
): Promise<Response<Endpoint, T>> {
  const url = new URL(baseAPIUrl + endpoint);

  if ("parameters" in request) {
    Object.keys(request.parameters).forEach((key) => {
      if (!("parameters" in request) || typeof request.parameters !== "object")
        return;

      if (
        request.parameters[key as keyof typeof request.parameters] === undefined
      ) {
        delete (request.parameters as Record<string, string>)[key];
        return;
      }

      if (!url.href.includes("%7B" + key + "%7D")) return;

      url.href = url.href.replace(
        "%7B" + key + "%7D",
        (request.parameters as Record<string, string>)[key]
      );

      delete (request.parameters as Record<string, string>)[key];
    });

    url.search = new URLSearchParams(
      request.parameters as Record<string, string>
    ).toString();
  }

  const body = "payload" in request ? JSON.stringify(request.payload) : null;

  let requestInit: RequestInit = {
    method: request.method as string,
    body: body,
    headers: {
      "Content-Type": "application/json",
      Authorization:
        authorize === null
          ? ""
          : authorize === true
          ? `Bearer ${(await getJWT()) ?? ""}`
          : `Bearer ${authorize}`,
    },
    credentials: includeCredentials ? "include" : "omit",
  };

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
