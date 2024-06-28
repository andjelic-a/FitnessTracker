import { APIRequest } from "../Types/Endpoints/RequestParser";
import { APIResponse } from "../Types/Endpoints/ResponseParser";

export default async function sendAPIRequest<T extends APIRequest>(
  request: T
): Promise<APIResponse<T>> {
  return request as any;
}

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
