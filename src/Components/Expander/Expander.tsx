import "./Expander.scss";
import Icon from "../Icon/Icon";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Flip from "gsap/Flip";

type ExpanderProps = {
  name: string;
  icon?: string;
  children: React.ReactNode | React.ReactNode[];
};

export default function Expander({ name, icon, children }: ExpanderProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const flipState = useRef<Flip.FlipState | null>(null);
  const expanderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!flipState.current) return;

    Flip.from(flipState.current, {
      onComplete: () => (flipState.current = null),
      onEnter: (elements) => {
        return gsap.fromTo(
          elements,
          {
            opacity: 0,
            y: "-=3rem",
          },
          {
            y: "+=3rem",
            opacity: 1,
            duration: 0.3,
          }
        );
      },
      onLeave: (elements) => {
        return gsap.to(elements, {
          opacity: 0,
          y: "-=3rem",
          duration: 0.3,
        });
      },
      absolute: true,
      duration: 0.3,
    });
  }, [isExpanded]);

  return (
    <div
      className={"expander" + (isExpanded ? " expanded" : "")}
      ref={expanderRef}
    >
      <div
        className="expander-header"
        onClick={() => {
          if (flipState.current || !expanderRef.current) return;

          flipState.current = Flip.getState(expanderRef.current.children);

          setIsExpanded(!isExpanded);
        }}
      >
        <Icon
          name={icon ?? ""}
          className={`expander-icon ${icon ? "visible" : "invisible"}`}
        />

        <p>{name}</p>

        <Icon
          name={`caret-${isExpanded ? "up" : "down"}`}
          className={`expander-icon`}
        />
      </div>

      <div className="expander-body">{children}</div>
    </div>
  );
}
