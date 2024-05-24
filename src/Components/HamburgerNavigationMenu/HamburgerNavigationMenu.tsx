import { useEffect, useRef, useState } from "react";
import "./HamburgerNavigationMenu.scss";
import "../Navigation/Navigation.scss";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import { useNavigate } from "react-router-dom";
gsap.registerPlugin(Flip);

/* interface HamburgerMenuProps
  extends DOMAttributes<HTMLElement>,
    HTMLAttributes<HTMLElement> {} */

type NavigationItem = {
  name: string;
  path: `/${string}`;
};

type NavigationProps = {
  items: NavigationItem[];
};

export default function HamburgerNavigationMenu({ items }: NavigationProps) {
  const hamburgerMenuRef = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP();

  const ClickHandler = () => {
    if (!navigationContainerRef.current || !hamburgerMenuRef.current) return;

    isAnimationActive.current = true;
    hamburgerMenuRef.current.classList.toggle("active");

    hamburgerMenuRef.current.classList.contains("active")
      ? playAppearAnimation()
      : playDisappearAnimation();
  };

  const playAppearAnimation = contextSafe(() => {
    gsap.to(navigationContainerRef.current, {
      x: 0,
      duration: 0.3,
      ease: "sine.inOut",
      onComplete: () => {
        isAnimationActive.current = false;
      },
    });
  });

  const playDisappearAnimation = contextSafe(() => {
    gsap.to(navigationContainerRef.current, {
      x: "-100%",
      duration: 0.3,
      ease: "sine.inOut",
      onComplete: () => {
        isAnimationActive.current = false;
      },
    });
  });

  const isAnimationActive = useRef<boolean>(false);
  const [selectedNavigationItemIdx, setSelectedNavigationItemIdx] =
    useState<number>(0);
  const navigationContainerRef = useRef<HTMLDivElement>(null);
  const selectionIndicatorRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  function handleSelect(i: number, path: string) {
    if (i === selectedNavigationItemIdx || isAnimationActive.current) return;

    playSelectAnimation(i);
    navigate(path);
  }

  const playSelectAnimation = contextSafe((i: number) => {
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
  });

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

    let pagePathIdx = items.findIndex((x) => x.path === pagePath);
    if (pagePathIdx === -1) pagePathIdx = 0;

    setSelectedNavigationItemIdx(pagePathIdx);
    navigationContainerRef.current?.children[pagePathIdx].classList.add(
      "selected"
    );
    selectionIndicatorRef.current.style.gridRow = `${pagePathIdx + 1}`;
  }, [items, navigationContainerRef.current, selectionIndicatorRef.current]);

  return (
    <>
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

      <h1>{items[selectedNavigationItemIdx].name}</h1>

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
    </>
  );
}
