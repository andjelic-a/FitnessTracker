import { APIRequest } from "../Types/Endpoints/RequestParser";
import { APIResponse } from "../Types/Endpoints/ResponseParser";

export default async function sendAPIRequest<T extends APIRequest>(
  request: T
): Promise<T> {
  return request as any;
}

const response = await sendAPIRequest({
  endpoint: "/api/muscle",
  request: {
    method: "post",
    payload: { muscleGroupId: 1, name: "test" },
  },
});
