import { useCallback, useEffect, useRef, useState } from "react";
import "./HamburgerNavigationMenu.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(Flip);

type NavigationItem = {
  name: string;
} & (
  | {
      path: `/${string}`;
    }
  | {
      defaultPath: `/${string}`;
      alternatePaths: `/${string}`[];
    }
);

type NavigationProps = {
  items: NavigationItem[];
  id?: string;
};

export default function HamburgerNavigationMenu({
  items,
  id,
}: NavigationProps) {
  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP();
  const isAnimationActive = useRef<boolean>(false);
  const [selectedNavigationItemIdx, setSelectedNavigationItemIdx] =
    useState<number>(0);
  const navigationContainerRef = useRef<HTMLDivElement>(null);
  const selectionIndicatorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const ClickHandler = () => {
    if (
      !navigationContainerRef.current ||
      !hamburgerMenuRef.current ||
      isAnimationActive.current
    )
      return;

    isAnimationActive.current = true;

    hamburgerMenuRef.current.classList.contains("active")
      ? playDisappearAnimation()
      : playAppearAnimation();
  };

  const playAppearAnimation = useCallback(
    contextSafe(() => {
      if (!hamburgerMenuRef.current || !navigationContainerRef.current) return;

      const startLineOldState = Flip.getState(
        hamburgerMenuRef.current.children[2]
      );

      hamburgerMenuRef.current.classList.add("active");
      const startLineRect =
        hamburgerMenuRef.current.children[2].getBoundingClientRect();
      gsap.set(navigationContainerRef.current, {
        top: startLineRect.y,
        left: startLineRect.x,
        width: startLineRect.width,
      });

      const timeline = gsap.timeline();
      timeline.add(
        Flip.from(startLineOldState, {
          duration: 0.07,
          ease: "sine.in",
        }),
        0
      );

      timeline.to(navigationContainerRef.current, {
        scaleY: 1,
        duration: 0.3,
        ease: "none",
      });

      timeline.to(
        navigationContainerRef.current,
        {
          width: "10em",
          duration: 0.3,
          ease: "sine.out",
        },
        ">-0.07"
      );

      timeline.to(
        navigationContainerRef.current.children,
        {
          x: "0%",
          stagger: 0.05,
          opacity: 1,
          duration: 0.3,
          ease: "sine.inOut",
        },
        "<+0.05"
      );

      timeline.eventCallback("onComplete", () => {
        isAnimationActive.current = false;
      });
    }),
    [hamburgerMenuRef.current, navigationContainerRef.current]
  );

  const playDisappearAnimation = useCallback(
    contextSafe(() => {
      if (!hamburgerMenuRef.current || !navigationContainerRef.current) return;

      const startLineOldState = Flip.getState(
        hamburgerMenuRef.current.children[2]
      );

      const startLineRect =
        hamburgerMenuRef.current.children[2].getBoundingClientRect();
      const timeline = gsap.timeline();

      timeline.to(navigationContainerRef.current, {
        width: startLineRect.width,
        duration: 0.25,
        ease: "sine.in",
      });

      timeline.to(
        navigationContainerRef.current.children,
        {
          x: "-5vw", //TODO: Replace with prop or something
          stagger: 0.025,
          opacity: 0,
          duration: 0.2,
          ease: "sine.inOut",
        },
        "<+0.025"
      );

      timeline.to(
        navigationContainerRef.current,
        {
          scaleY: 0,
          duration: 0.3,
          ease: "none",
        },
        `<+0.25`
      );

      hamburgerMenuRef.current.classList.remove("active");
      timeline.add(
        Flip.from(startLineOldState, {
          duration: 0.03,
          ease: "none",
        })
      );

      timeline.eventCallback("onComplete", () => {
        isAnimationActive.current = false;
      });
    }),
    [hamburgerMenuRef.current, navigationContainerRef.current]
  );

  function handleSelect(i: number, path: string) {
    if (i === selectedNavigationItemIdx || isAnimationActive.current) return;

    playSelectAnimation(i);
    navigate(path);
  }

  const playSelectAnimation = useCallback(
    contextSafe((i: number) => {
      if (!navigationContainerRef.current || !selectionIndicatorRef.current)
        return;
      isAnimationActive.current = true;

      const oldSelectedNavigationItem =
        navigationContainerRef.current?.children[selectedNavigationItemIdx];
      const newSelectedNavigationItem =
        navigationContainerRef.current.children[i];

      //Gets old/current positions of old and new selected navigation items and the selection indicator
      const oldSelectedNavigationItem_State = Flip.getState(
        oldSelectedNavigationItem
      );
      const newSelectedNavigationItem_State = Flip.getState(
        newSelectedNavigationItem
      );
      const selectionIndicator_State = Flip.getState(
        selectionIndicatorRef.current
      );

      //Sets new positions of old and new selected navigation items and the selection indicator using grid
      gsap.set(selectionIndicatorRef.current, {
        gridRow: i + 1,
      });
      oldSelectedNavigationItem.classList.remove("selected");
      newSelectedNavigationItem.classList.add("selected");

      //Animations
      const timeline = gsap.timeline();

      timeline.add(
        Flip.from(selectionIndicator_State, {
          duration: 0.17 * Math.abs(i - selectedNavigationItemIdx),
          ease: "sine.inOut",
        }),
        0
      );

      function addNavigationItemsToTimeline(item: Element) {
        timeline.to(
          item,
          {
            x: "1.5em", //TODO: Make this a variable or prop or something that is not hardcoded
            duration: 0.2,
            repeatDelay: 0.04 * Math.abs(i - selectedNavigationItemIdx),
            yoyo: true,
            repeat: 1,
          },
          "<+0.075"
        );
      }

      //Animates the elements in between the old and new selected navigation items
      if (selectedNavigationItemIdx < i) {
        for (let j = selectedNavigationItemIdx + 1; j < i; j++)
          addNavigationItemsToTimeline(
            navigationContainerRef.current?.children[j]
          );
      } else {
        for (let j = selectedNavigationItemIdx - 1; j > i; j--)
          addNavigationItemsToTimeline(
            navigationContainerRef.current?.children[j]
          );
      }

      timeline.add(
        Flip.from(newSelectedNavigationItem_State, {
          duration: 0.33,
        }),
        "<"
      );

      timeline.add(
        Flip.from(oldSelectedNavigationItem_State, {
          duration: 0.33,
        }),
        "<"
      );

      setSelectedNavigationItemIdx(i);
      timeline.eventCallback("onComplete", () => {
        isAnimationActive.current = false;
      });
    }),
    [
      navigationContainerRef.current,
      selectionIndicatorRef.current,
      selectedNavigationItemIdx,
    ]
  );

  //On refresh / startup / loading the page, select the correct navigation item
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

    let pagePathIdx = items.findIndex((x) => {
      if ("path" in x) return x.path === pagePath;
      else
        return (
          x.defaultPath === pagePath ||
          x.alternatePaths.includes(pagePath as `/${string}`)
        );
    });
    if (pagePathIdx === -1) pagePathIdx = 0;

    setSelectedNavigationItemIdx(pagePathIdx);
    navigationContainerRef.current?.children[pagePathIdx].classList.add(
      "selected"
    );
    selectionIndicatorRef.current.style.gridRow = `${pagePathIdx + 1}`;
  }, [items]);

  return (
    <div id={id}>
      <div className="hamburger-menu-wrapper">
        <div
          className="hamburger-menu"
          ref={hamburgerMenuRef}
          onClick={ClickHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div
        className="navigation"
        ref={navigationContainerRef}
        style={{
          gridTemplateRows: `repeat(${items.length}, max-content)`,
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            onClick={() =>
              handleSelect(i, "path" in item ? item.path : item.defaultPath)
            }
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
    </div>
  );
}
