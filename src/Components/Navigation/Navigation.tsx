import { useGSAP } from "@gsap/react";
import "./Navigation.scss";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
gsap.registerPlugin(Flip);

interface NavigationProps {
  shown: boolean;
  items: {
    name: string;
    path: string;
  }[];
}

export default function Navigation({ shown, items }: NavigationProps) {
  const { contextSafe } = useGSAP();
  const isAnimationActive = useRef(false);
  const selectedNavigationItemRef = useRef<number>(0);
  const navigationContainerRef = useRef<HTMLDivElement>(null);
  const selectionIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shown ? playAppearAnimation() : playDisappearAnimation();
  }, [shown]);

  const playAppearAnimation = contextSafe(() => {
    if (!navigationContainerRef.current) return;

    gsap.to(navigationContainerRef.current, {
      x: 0,
      duration: 0.3,
      ease: "sine.inOut",
    });
  });

  const playDisappearAnimation = contextSafe(() => {
    if (!navigationContainerRef.current) return;

    gsap.to(navigationContainerRef.current, {
      x: "-100%",
      duration: 0.3,
      ease: "sine.inOut",
    });
  });

  const playSelectAnimation = contextSafe((i: number) => {
    if (
      isAnimationActive.current ||
      !navigationContainerRef.current ||
      !selectionIndicatorRef.current ||
      selectedNavigationItemRef.current === i
    )
      return;

    isAnimationActive.current = true;

    const oldSelectedNavigationItemsState = Flip.getState(
      navigationContainerRef.current?.children[
        selectedNavigationItemRef.current
      ]
    );

    const newSelectedNavigationItemsState = Flip.getState(
      navigationContainerRef.current?.children[i]
    );

    const selectionIndicatorState = Flip.getState(
      selectionIndicatorRef.current
    );

    gsap.set(selectionIndicatorRef.current, {
      gridRow: i + 1,
    });

    navigationContainerRef.current?.children[
      selectedNavigationItemRef.current
    ].classList.remove("selected");

    navigationContainerRef.current?.children[i].classList.add("selected");
    const timeline = gsap.timeline();

    timeline.add(
      Flip.from(selectionIndicatorState, {
        duration: 0.17 * Math.abs(i - selectedNavigationItemRef.current),
        ease: "sine.inOut",
      }),
      0
    );

    function addNavigationItemsToTimeline(item: Element) {
      timeline.to(
        item,
        {
          x: "1.5em",
          duration: 0.2,
          repeatDelay: 0.04 * Math.abs(i - selectedNavigationItemRef.current),
          yoyo: true,
          repeat: 1,
        },
        "<+0.075"
      );
    }

    if (selectedNavigationItemRef.current < i) {
      for (let j = selectedNavigationItemRef.current + 1; j < i; j++)
        addNavigationItemsToTimeline(
          navigationContainerRef.current?.children[j]
        );
    } else {
      for (let j = selectedNavigationItemRef.current - 1; j > i; j--)
        addNavigationItemsToTimeline(
          navigationContainerRef.current?.children[j]
        );
    }

    timeline.add(
      Flip.from(newSelectedNavigationItemsState, {
        duration: 0.33,
      }),
      "<"
    );

    timeline.add(
      Flip.from(oldSelectedNavigationItemsState, {
        duration: 0.33,
      }),
      "<-0.075"
    );

    timeline.eventCallback("onComplete", () => {
      selectedNavigationItemRef.current = i;
      isAnimationActive.current = false;

      for (
        let j = 0;
        j < navigationContainerRef.current!.children.length;
        j++
      ) {
        const child = navigationContainerRef.current!.children[j];
        if (
          child.classList.contains("selected") &&
          j !== selectedNavigationItemRef.current
        )
          child.classList.remove("selected");
      }

      gsap.set(navigationContainerRef.current!.children, {
        x: 0,
      });
    });
  });

  function onSelect(i: number) {
    playSelectAnimation(i);
  }

  return (
    <div className="navigation" ref={navigationContainerRef}>
      {items.map((item, i) => (
        <Link
          key={i}
          to={item.path}
          onClick={() => onSelect(i)}
          className={`navigation-item ${i === 0 ? "selected" : ""}`}
        >
          {item.name}
        </Link>
      ))}
      <div className="selection-indicator" ref={selectionIndicatorRef}>
        ●
      </div>
    </div>
  );
}
