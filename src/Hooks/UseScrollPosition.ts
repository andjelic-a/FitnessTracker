import { RefObject, useEffect, useRef, useState } from "react";

export default function useScrollPosition(
  target: string | RefObject<HTMLElement>
) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const elementRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const element =
      typeof target === "string"
        ? document.querySelector(target)
        : target.current;

    if (!element) {
      console.log("No element found with target", target);
      return;
    }

    elementRect.current = element.getBoundingClientRect();

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [target]);

  function handleScroll(e: Event) {
    const element = e.target as HTMLElement;
    const scrollPercentage =
      element.scrollTop / (element.scrollHeight - element.clientHeight);

    setScrollPosition(scrollPercentage);
  }

  return scrollPosition;
}
