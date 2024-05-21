import { useGSAP } from "@gsap/react";
import "./Navigation.scss";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(Flip);

interface NavigationProps {
  shown: boolean;
  items: {
    name: string;
    path: `/${string}`;
  }[];
}

export default function Navigation({ shown, items }: NavigationProps) {
  const { contextSafe } = useGSAP();
  const isAnimationActive = useRef(false);
  const selectedNavigationItemRef = useRef<number>(0);
  const navigationContainerRef = useRef<HTMLDivElement>(null);
  const selectionIndicatorRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  useEffect(() => {
    shown ? playAppearAnimation() : playDisappearAnimation();
  }, [shown]);

  useEffect(() => {
    if (
      !navigationContainerRef.current ||
      !selectionIndicatorRef.current ||
      items.length < 1
    )
      return;

    const locationURLParts = window.location.pathname
      .split("/")
      .filter((x) => x !== "");

    const pagePath =
      locationURLParts.length < 1 ? "/" : "/" + locationURLParts[0];

    let pagePathIdx = items.findIndex((x) => x.path === pagePath);
    if (pagePathIdx === -1) pagePathIdx = 0;

    selectedNavigationItemRef.current = pagePathIdx;
    navigationContainerRef.current?.children[pagePathIdx].classList.add(
      "selected"
    );
    selectionIndicatorRef.current.style.gridRow = `${pagePathIdx + 1}`;
  }, [items, navigationContainerRef.current, selectionIndicatorRef.current]);

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

  function handleSelect(i: number, path: string) {
    if (i === selectedNavigationItemRef.current) return;

    playSelectAnimation(i);
    navigate(path);
  }

  return (
    <div className="navigation" ref={navigationContainerRef}>
      {items.map((item, i) => (
        <div
          key={i}
          onClick={() => handleSelect(i, item.path)}
          className={`navigation-item`}
          style={{
            gridRow: i + 1,
          }}
        >
          {item.name}
        </div>
      ))}
      <div className="selection-indicator" ref={selectionIndicatorRef}>
        ●
      </div>
    </div>
  );
}
