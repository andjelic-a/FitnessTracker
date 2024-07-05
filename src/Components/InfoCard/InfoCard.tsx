import "./InfoCard.scss";
import Icon from "../Icon/Icon";
import FormattedText from "../FormattedText/FormattedText";
import { useCallback, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

type InfoCardProps = {
  children: string;
};

export default function InfoCard({ children }: InfoCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLElement>(null);
  const isVisibleRef = useRef(false);

  const { contextSafe } = useGSAP(
    () => {
      if (!containerRef.current || !iconRef.current) return;

      const iconRect = iconRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      gsap.set(containerRef.current, {
        alpha: 0,
        scale: 0.5,
        transformOrigin: "center",
        top: iconRect.top - containerRect.height,
        left: iconRect.right,
      });
    },
    {
      dependencies: [containerRef.current, iconRef.current],
    }
  );

  const reveal = useCallback(
    contextSafe(() => {
      if (!containerRef.current) return;
      isVisibleRef.current = true;

      gsap.to(containerRef.current, {
        alpha: 1,
        scale: 1,
        duration: 0.4,
      });
    }),
    [containerRef.current, contextSafe]
  );

  const hide = useCallback(
    contextSafe(() => {
      if (!containerRef.current) return;
      isVisibleRef.current = false;

      gsap.to(containerRef.current, {
        alpha: 0,
        scale: 0.5,
        duration: 0.25,
      });
    }),
    [containerRef.current, contextSafe]
  );

  const toggle = isVisibleRef.current ? hide : reveal;

  useEffect(() => {
    if (!iconRef.current) return;

    iconRef.current.addEventListener("mouseenter", reveal);
    iconRef.current.addEventListener("mouseleave", hide);
    iconRef.current.addEventListener("click", toggle);

    return () => {
      if (!iconRef.current) return;

      iconRef.current.removeEventListener("mouseenter", reveal);
      iconRef.current.removeEventListener("mouseleave", hide);
      iconRef.current.removeEventListener("click", toggle);
    };
  }, [iconRef.current, reveal]);

  return (
    <>
      <Icon name="question-circle" className="info-icon" ref={iconRef} />
      <div className="info-card-container" ref={containerRef}>
        <Icon name="info-circle"></Icon>
        <FormattedText>{children}</FormattedText>
      </div>
    </>
  );
}
