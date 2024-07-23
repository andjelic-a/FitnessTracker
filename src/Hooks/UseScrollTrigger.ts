import { Observer } from "gsap/Observer";
import gsap from "gsap";
import { RefObject, useEffect, useRef } from "react";
gsap.registerPlugin(Observer);

export default function useScrollTrigger(
  box: RefObject<HTMLElement>,
  threshold: number,
  onEnter?: () => void,
  onLeave?: () => void
) {
  const reachedLazyLoadingThreshold = useRef(false);

  useEffect(() => {
    if (!box.current) return;

    const scrollHeight = box.current.scrollHeight - box.current.clientHeight;
    const triggerPoint = scrollHeight * threshold;

    const observer = Observer.create({
      target: box.current,
      type: "scroll",
      onChange: (self) => {
        const currentScroll = self.scrollY();

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
