import { RefObject, useEffect } from "react";

export default function useOutsideClick(
  ref:
    | RefObject<HTMLElement>
    | RefObject<HTMLElement | null>
    | RefObject<HTMLElement[]>
    | RefObject<(HTMLElement | null)[]>,
  callback: () => void,
  type: "left" | "all" = "all"
) {
  const handleClick = (event: MouseEvent) => {
    if (type === "left" && event.button !== 0) return;

    if (!ref?.current) return;

    if (
      (Array.isArray(ref.current) &&
        !ref.current.find((x) => x?.contains(event.target as Node))) ||
      (!Array.isArray(ref.current) &&
        !ref.current.contains(event.target as Node))
    ) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}
