import "./RoutineItem.scss";
import React, { useEffect, useRef, useCallback } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { v4 as uuidv4 } from "uuid";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Flip from "gsap/Flip";
import reorderArray from "../ReorderArray.ts";
import { PossibleSetIcon, Set } from "./RoutineItem.tsx";
import RoutineSetDisplay from "./RoutineSetDisplay.tsx";

type ExerciseSetProps = {
  onStartDraggingSet?: () => void;
  onEndDraggingSet?: () => void;
  // onChange?: (sets: Set[]) => void;
  safeGuard?: number;
  animationLength?: number;
  sets: Set[];
  setSets: React.Dispatch<React.SetStateAction<Set[]>>;
};

export default function RoutineExerciseDisplay({
  onStartDraggingSet,
  onEndDraggingSet,
  // onChange,
  animationLength,
  safeGuard,
  sets,
  setSets,
}: ExerciseSetProps): JSX.Element {
  const excludedDivRef = useRef<(HTMLDivElement | null)[]>([]);

  useOutsideClick(excludedDivRef, () => {
    setSets((prevSets) =>
      prevSets.map((set) => ({ ...set, isDropdownOpen: false }))
    );
  });

  const addSet = () => {
    const newSet: Set = {
      id: uuidv4(),
      idx: sets.length + 1,
      rir: 0,
      repRange: "0",
      isDropdownOpen: false,
      selectedIcon: null,
    };

    setSets([...sets, newSet]);
  };

  const handleSetClick = (id: string) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id
          ? { ...set, isDropdownOpen: !set.isDropdownOpen }
          : { ...set, isDropdownOpen: false }
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      excludedDivRef.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          setSets((prevSets) =>
            prevSets.map((set, i) =>
              i === index ? { ...set, isDropdownOpen: false } : set
            )
          );
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const findPositionOfElement = (id: string) => {
    return sets.findIndex((set) => set.id === id);
  };

  const changeSetIcon = (id: string, icon: PossibleSetIcon) => {
    setSets((prevSets) => {
      return prevSets.map((set) => {
        if (set.id === id) {
          if (icon === "1") {
            return {
              ...set,
              selectedIcon: null,
              idx: findPositionOfElement(id) + 1,
              isDropdownOpen: false,
            };
          } else {
            return {
              ...set,
              selectedIcon: icon,
              isDropdownOpen: false,
            };
          }
        } else {
          return set;
        }
      });
    });
  };

  const deleteSet = (id: string) => {
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((set) => set.id !== id);

      return updatedSets.map((set, index) => ({
        ...set,
        set: index + 1,
      }));
    });
  };

  const { contextSafe } = useGSAP();
  const dragging = useRef<HTMLElement | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const currentFlipTimeline = useRef<gsap.core.Timeline | null>(null);
  const isDraggingAvailable = useRef(true);
  const isDragging = useRef(false);
  const preAnimationRect = useRef<DOMRect | undefined>(undefined);
  const setContainerRef = useRef<HTMLDivElement>(null);
  const isMoveAvailable = useRef(true);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      let element = document.elementFromPoint(touch.clientX, touch.clientY);

      while (element && !element.classList.contains("exercise-set-item"))
        element = element.parentElement;

      if (!element) return;

      handleHoverOverItem(element as HTMLElement);
    },
    [handleHoverOverItem]
  );

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove);
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleTouchMove]);

  useEffect(() => {
    preAnimationRect.current = dragging.current?.getBoundingClientRect();
    playReorderAnimation();
    // onChange?.(sets);
  }, [sets]);

  const playReorderAnimation = contextSafe(() => {
    if (!currentFlipState.current) return;

    isMoveAvailable.current = false;
    setTimeout(() => void (isMoveAvailable.current = true), safeGuard ?? 20);

    gsap.set(setContainerRef.current!.childNodes, {
      x: 0,
      y: 0,
    });

    currentFlipTimeline.current = Flip.from(currentFlipState.current, {
      duration: animationLength ?? 0.2,
      onComplete: () => {
        currentFlipState.current = null;
        currentFlipTimeline.current = null;

        setContainerRef.current!.childNodes.forEach(
          (x) => void ((x as HTMLElement).style.transform = "")
        );
      },
    });

    return;
  });

  function handleSetChanged(set: Set) {
    setSets((prevSets) =>
      prevSets.map((prevSet) => (prevSet.id === set.id ? set : prevSet))
    );
  }

  function handleHoverOverItem(target: HTMLElement) {
    if (
      !isDragging.current ||
      !dragging.current ||
      dragging.current.contains(target) ||
      !isMoveAvailable.current
    )
      return;

    let element: HTMLElement | null = target;
    while (element && !element.classList.contains("exercise-set-item")) {
      element = element.parentNode as HTMLElement;
    }
    if (!element) return;

    const hoverId = element.id.replace("exercise-set-item-", "");
    const hoverIdx = sets.findIndex((x) => x.id === hoverId);

    const draggingId = dragging.current!.id.replace("exercise-set-item-", "");
    const draggingIdx = sets.findIndex((x) => x.id === draggingId);

    if (
      hoverIdx === undefined ||
      draggingIdx === undefined ||
      hoverIdx === draggingIdx
    )
      return;

    if (currentFlipTimeline.current) {
      currentFlipTimeline.current.kill();
      currentFlipTimeline.current = null;
    }
    currentFlipState.current = Flip.getState(setContainerRef.current!.children);

    setSets((prev) => {
      prev = reorderArray(prev, draggingIdx, hoverIdx);
      prev.forEach((x, i) => {
        if (!x.selectedIcon || x.selectedIcon === "1") x.idx = i + 1;
      });

      return prev;
    });
  }

  const beginDragging = contextSafe((element: HTMLElement) => {
    if (!isDraggingAvailable) return;
    isDraggingAvailable.current = false;
    onStartDraggingSet?.();

    element.classList.add("dragging");
    dragging.current = element;
    isDragging.current = true;
  });

  const endDragging = contextSafe(() => {
    if (isDraggingAvailable.current || !isDragging.current || !dragging.current)
      return;

    dragging.current.classList.remove("dragging");
    isDragging.current = false;
    onEndDraggingSet?.();
  });

  return (
    <div className="exercise-set" ref={setContainerRef}>
      <div className="exercise-set-placeholder">
        <p>SET</p>
        <p>RiR</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set, index) => (
        <RoutineSetDisplay
          key={set.id}
          set={set}
          onSetChanged={handleSetChanged}
          index={index}
          onSetClick={handleSetClick}
          onDeleteSet={deleteSet}
          onChangeSetIcon={changeSetIcon}
          dropDownMenuWrapper={excludedDivRef}
          onDragStart={beginDragging}
          onDragEnd={endDragging}
          onMouseOver={handleHoverOverItem}
        />
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}
