import { useEffect, useRef } from "react";
import { Endpoints } from "../../Types/Endpoints/Endpoints";
import { Request } from "../../Types/Endpoints/RequestParser";

type LazyLoadingContainerProps<T extends Endpoints> = {
  baseAPIRequest: Request<T>;
};

type RequestIsh = {
  method: "get";
  parameters: {
    offset: number;
    limit: number;
  };
};

export default function LazyLoadingContainer<T extends Endpoints>({
  baseAPIRequest,
}: LazyLoadingContainerProps<T>) {
  const currentRequest = useRef<RequestIsh | null>(null);

  useEffect(() => {
    if (isValidRequest(baseAPIRequest)) currentRequest.current = baseAPIRequest;
  }, [baseAPIRequest]);

  function isValidRequest(request: {}): request is RequestIsh {
    if (!("method" in request) || request.method !== "get") return false;

    if (
      !("parameters" in request) ||
      typeof request.parameters !== "object" ||
      !request.parameters
    )
      return false;

    if (
      !("offset" in request.parameters) ||
      typeof request.parameters.offset !== "number"
    )
      return false;

    if (
      !("limit" in request.parameters) ||
      typeof request.parameters.limit !== "number"
    )
      return false;

    return true;
  }

  function incrementRequest(): RequestIsh | null {
    if (!currentRequest.current) return null;

    return {
      ...currentRequest.current,
      parameters: {
        ...currentRequest.current.parameters,
        offset:
          currentRequest.current.parameters.limit +
          currentRequest.current.parameters.offset,
      },
    };
  }

  return <div>LazyLoadingContainer</div>;
}
