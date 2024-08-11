import { memo, ReactNode, useEffect, useRef } from "react";
import sendAPIRequest from "../../Data/SendAPIRequest";
import { APIResponse } from "../../Types/Endpoints/ResponseParser";
import Async from "../Async/Async";
import * as portals from "react-reverse-portal";

type LazySegmentProps = {
  onSegmentLoad: (
    response: Awaited<ReturnType<typeof sendAPIRequest<any, any>>>
  ) => ReactNode;
  promise: Promise<APIResponse<any, any>>;
};

const LazySegment = memo<LazySegmentProps>(({ onSegmentLoad, promise }) => {
  console.log("rerender lazy segment", promise);
  const thresholdMarker = useRef<HTMLDivElement>(null);
  const portal = portals.createHtmlPortalNode({
    attributes: {
      class: "lazy-loading-threshold-marker",
    },
  });

  useEffect(() => {
    console.log("effect");
    if (!thresholdMarker.current) return;
    console.log("effect, not null");

    const observer = new IntersectionObserver(
      ([marker], self) => {
        if (
          marker &&
          marker.isIntersecting &&
          marker.intersectionRatio >= 0.5
        ) {
          console.log("intersecting");

          self.unobserve(marker.target);
          marker.target.remove();

          portal.unmount();
          self.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    observer.observe(thresholdMarker.current);

    return () => {
      observer.unobserve(thresholdMarker.current!);
    };
  }, [thresholdMarker]);

  return (
    <div className="lazy-segment">
      <portals.InPortal node={portal}>
        <div ref={thresholdMarker} />
      </portals.InPortal>

      <Async await={promise}>
        {(data) => (
          <>
            <portals.OutPortal node={portal} />
            {onSegmentLoad(data)}
          </>
        )}
      </Async>
    </div>
  );
});

export default LazySegment;
