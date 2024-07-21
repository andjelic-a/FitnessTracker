import { useEffect, useRef } from "react";
import useScrollPosition from "./UseScrollPosition";

/**
 * Custom React hook that triggers a callback function when a scroll event
 * reaches a certain point on a specified element.
 *
 * @param {string} triggerElement - The ID or class name of the element to
 * monitor for scroll events.
 * @param {number} triggerPoint - The scroll position at which the callback
 * function should be triggered.
 * @param {() => void | Promise<void>} callback - The function to be called
 * when the scroll event reaches the trigger point.
 * @return {void}
 */
export default function useLazyLoading(
  triggerElement: string | HTMLElement,
  triggerPoint: number,
  callback: () => void | Promise<void>
): void {
  const scrollPosition = useScrollPosition(triggerElement);
  const recordedScrollPosition = useRef(0);

  useEffect(() => {
    if (
      scrollPosition >= triggerPoint &&
      recordedScrollPosition.current < triggerPoint
    )
      callback();

    recordedScrollPosition.current = scrollPosition;
  }, [scrollPosition]);
}
