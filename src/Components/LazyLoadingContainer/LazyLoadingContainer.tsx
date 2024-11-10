import "./LazyContainer.scss";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Endpoints } from "../../Types/Endpoints/Endpoints";
import { Request } from "../../Types/Endpoints/RequestParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import LazySegment from "./LazySegment";
import genericMemo from "../../Utility/GenericMemo";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";

type LazyLoadingContainerProps<
  Endpoint extends Endpoints,
  BaseRequest extends Request<Endpoint>
> = {
  endpoint: Endpoint;
  baseAPIRequest: BaseRequest extends {
    method: "get";
  }
    ? BaseRequest
    : never;
  onSegmentLoad: (
    response: Awaited<ReturnType<typeof sendAPIRequest<BaseRequest, Endpoint>>>,
    segmentIndex: number
  ) => ReactNode;
  stopCondition: (
    response: Awaited<ReturnType<typeof sendAPIRequest<BaseRequest, Endpoint>>>
  ) => boolean;

  before?: ReactNode;
  after?: ReactNode;
};

export type OnlyGet<T extends Request<any>> = T extends {
  method: "get";
}
  ? T
  : never;

type RequestIsh = {
  method: "get";
  parameters: {
    offset: number;
    limit: number;
  };
};

function LazyLoadingContainer<
  Endpoint extends Endpoints,
  BaseRequest extends Request<Endpoint>
>({
  endpoint,
  baseAPIRequest,
  onSegmentLoad,
  stopCondition,
  before,
  after,
}: LazyLoadingContainerProps<Endpoint, BaseRequest>) {
  const [segments, setSegments] = useState<Promise<APIResponse<any, any>>[]>(
    []
  );
  const currentRequest = useRef<RequestIsh | null>(null);
  const isWaiting = useRef<boolean>(false);
  const isWaitingForInitial = useRef<boolean>(false);

  useEffect(() => {
    if (!isValidRequest(baseAPIRequest) || isWaitingForInitial.current) return;

    currentRequest.current = baseAPIRequest;
    isWaiting.current = true;
    isWaitingForInitial.current = true;

    const response = sendAPIRequest(endpoint, baseAPIRequest).then((x) => {
      if (!stopCondition(x)) isWaiting.current = false;
      isWaitingForInitial.current = false;
      return x;
    });

    setSegments(() => [response]);
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

  function handleNewSegmentLoad(): boolean {
    if (!currentRequest.current || isWaiting.current) return false;

    function isResponse(response: {}): response is {
      code: string;
    } {
      return "code" in response && typeof response.code === "string";
    }

    isWaiting.current = true;
    const newRequest = incrementRequest();

    const response = sendAPIRequest(endpoint, newRequest as any).then((x) => {
      if (!isResponse(x)) return x;

      if ((x as any).code === "Too Many Requests") {
        setTimeout(() => void (isWaiting.current = true), 1000);
        return x;
      }

      currentRequest.current = newRequest;
      if (!stopCondition(x)) isWaiting.current = false;
      return x;
    });

    setSegments((oldSegments) => [...oldSegments, response]);
    return true;
  }

  return (
    <div className="lazy-container">
      {before && <div className="lazy-segment before">{before}</div>}
      {segments.map((segment, i) => (
        <LazySegment
          onReachLoadThreshold={handleNewSegmentLoad}
          key={`segment-${i}`}
          onSegmentLoad={(x) => onSegmentLoad(x, i)}
          promise={segment}
        />
      ))}
      {after && <div className="lazy-segment after">{after}</div>}
    </div>
  );
}

export default genericMemo(LazyLoadingContainer);
