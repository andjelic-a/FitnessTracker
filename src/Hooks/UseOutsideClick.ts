import { RefObject, useEffect } from "react";

export default function useOutsideClick(
  ref:
    | RefObject<HTMLElement>
    | RefObject<HTMLElement | null>
    | RefObject<HTMLElement[]>
    | RefObject<(HTMLElement | null)[]>
    | RefObject<HTMLElement>[],
  callback: () => void,
  type: "left" | "all" = "all"
) {
  const handleClick = (event: MouseEvent) => {
    if (document.body.classList.contains("ReactModal__Body--open")) return;
    if (type === "left" && event.button !== 0) return;

    if ("current" in ref) {
      if (!ref?.current) return;

      const target = event.target as HTMLElement;
      if (target.classList.contains("drag-overlay")) return;

      if (
        (Array.isArray(ref.current) &&
          !ref.current.find((x) => x?.contains(target as Node))) ||
        (!Array.isArray(ref.current) && !ref.current.contains(target as Node))
      ) {
        callback();
      }
    } else {
      if (!ref || !Array.isArray(ref)) return;

      const target = event.target as HTMLElement;
      if (target.classList.contains("drag-overlay")) return;

      let found: boolean = false;
      ref.forEach((ref) => {
        if (ref.current?.contains(target as Node)) found = true;
      });

      if (!found) callback();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, callback]);
}