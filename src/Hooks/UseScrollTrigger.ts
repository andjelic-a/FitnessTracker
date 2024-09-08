import { Observer } from "gsap/Observer";
import gsap from "gsap";
import { RefObject, useEffect, useRef } from "react";
gsap.registerPlugin(Observer);

export default function useScrollTrigger(
  box: RefObject<HTMLElement>,
  threshold: number,
  axis: "y" | "x" = "y",
  onEnter?: () => void,
  onLeave?: () => void
) {
  const reachedLazyLoadingThreshold = useRef(false);

  useEffect(() => {
    if (!box.current) return;

    const scrollSize =
      axis === "y"
        ? box.current.scrollHeight - box.current.clientHeight
        : box.current.scrollWidth - box.current.clientWidth;

    const triggerPoint = scrollSize * threshold;
    const observer = Observer.create({
      target: box.current,
      type: "scroll",
      onChange: (self) => {
        const currentScroll = axis === "y" ? self.scrollY() : self.scrollX();

        // Check if the current scroll position crosses the 70% threshold
        if (
          currentScroll >= triggerPoint &&
          !reachedLazyLoadingThreshold.current
        ) {
          onEnter?.();
          reachedLazyLoadingThreshold.current = true; // Mark the threshold as crossed
        } else if (
          currentScroll < triggerPoint &&
          reachedLazyLoadingThreshold.current
        ) {
          onLeave?.();
          reachedLazyLoadingThreshold.current = false; // Reset the trigger state when leaving
        }
      },
    });

    return () => observer.kill();
  }, [box, threshold, onEnter, onLeave]);
}
