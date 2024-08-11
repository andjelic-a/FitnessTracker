import "./LazyContainer.scss";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Endpoints } from "../../Types/Endpoints/Endpoints";
import { Request } from "../../Types/Endpoints/RequestParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import LazySegment from "./LazySegment";

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
    response: Awaited<ReturnType<typeof sendAPIRequest<BaseRequest, Endpoint>>>
  ) => ReactNode;
  stopCondition: (
    response: Awaited<ReturnType<typeof sendAPIRequest<BaseRequest, Endpoint>>>
  ) => boolean;
};

type RequestIsh = {
  method: "get";
  parameters: {
    offset: number;
    limit: number;
  };
};

export default function LazyLoadingContainer<
  Endpoint extends Endpoints,
  BaseRequest extends Request<Endpoint>
>({
  endpoint,
  baseAPIRequest,
  onSegmentLoad,
  stopCondition,
}: LazyLoadingContainerProps<Endpoint, BaseRequest>) {
  const [segments, setSegments] = useState<ReactNode[]>([]);
  const currentRequest = useRef<RequestIsh | null>(null);
  const isWaiting = useRef<boolean>(false);

  useEffect(() => {
    if (!isValidRequest(baseAPIRequest) || isWaiting.current) return;

    currentRequest.current = baseAPIRequest;
    isWaiting.current = true;

    const response = sendAPIRequest(endpoint, baseAPIRequest as any).then(
      (x) => {
        isWaiting.current = false;
        return x;
      }
    );

    setSegments((oldSegments) => [
      <LazySegment
        onReachLoadThreshold={handleNewSegmentLoad}
        key={"segment-" + oldSegments.length}
        onSegmentLoad={onSegmentLoad}
        promise={response}
      />,
    ]);
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
      if (!isResponse(x) || (x as any).code !== "Too Many Requests")
        currentRequest.current = newRequest;

      if (!stopCondition(x)) isWaiting.current = false;
      return x;
    });

    setSegments((oldSegments) => [
      ...oldSegments,
      <LazySegment
        onReachLoadThreshold={handleNewSegmentLoad}
        key={"segment-" + oldSegments.length}
        onSegmentLoad={(x) => {
          return onSegmentLoad(x);
        }}
        promise={response}
      />,
    ]);

    return true;
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        gap: "10px",
      }}
    >
      {segments}
    </div>
  );
}
