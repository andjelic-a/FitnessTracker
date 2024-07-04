import { useEffect, useRef, useState } from "react";

export default function useScrollPosition(target: string) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const elementRect = useRef<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(target);
    console.log(element);
    
    if (!element) return;
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
    
    console.log(
      element.scrollTop,
      element.scrollHeight - element.clientHeight,
      scrollPercentage
    );
  }

  return scrollPosition;
}
