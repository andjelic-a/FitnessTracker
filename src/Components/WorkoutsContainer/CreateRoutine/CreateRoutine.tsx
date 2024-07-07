import { useRef, useEffect, useState, useCallback } from "react";
import RoutineItem from "./RoutineItem/RoutineItem";
import "./CreateRoutine.scss";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "./ReorderArray";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(Flip);
gsap.registerPlugin(Observer);

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
}

export default function CreateRoutine({
  isNewWindowOpen,
  setIsNewWindowOpen,
}: CreateRoutineProps) {
  const [routineItems, setRoutineItems] = useState<string[]>([]);

  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineTitleRef = useRef<HTMLInputElement | null>(null);

  const dragging = useRef<HTMLElement | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const movableRef = useRef<HTMLElement | null>(null);
  const isDraggingAvailable = useRef(true);
  const isDragging = useRef(false);
  const { contextSafe } = useGSAP();
  const preAnimationRect = useRef<DOMRect | undefined>(undefined);
  const routineItemContainerRef = useRef<HTMLDivElement>(null);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      let element = document.elementFromPoint(touch.clientX, touch.clientY);

      while (element && !element.classList.contains("routine-item"))
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
    if (!currentFlipState.current) return;

    preAnimationRect.current = dragging.current?.getBoundingClientRect();
    playReorderAnimation();
  }, [routineItems]);

  const playReorderAnimation = contextSafe(() => {
    console.log("reordering");

    if (currentFlipState.current)
      Flip.from(currentFlipState.current, {
        duration: 0.3,
        onComplete: () => {
          currentFlipState.current = null;
        },
      });

    if (movableRef.current)
      gsap.to(movableRef.current, {
        height: preAnimationRect.current?.height,
        duration: 0.3,
      });
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        excludedDivRef.current &&
        !excludedDivRef.current.contains(event.target as Node)
      ) {
        setIsNewWindowOpen(false);
        if (routineTitleRef.current) {
          routineTitleRef.current.value = "";
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsNewWindowOpen]);

  const handleDeleteExercise = (id: string) => {
    console.log("handleDeleteExercise", id);
    setRoutineItems((prevState) => prevState.filter((item) => item !== id));
  };

  const handleAddNewExerciseClick = () => {
    const id = uuidv4();
    const newItem = id;
    setRoutineItems((prevState) => [...prevState, newItem]);
  };

  const handleSaveClick = () => {
    setRoutineItems([]);
    setIsNewWindowOpen(false);
  };

  function handleHoverOverItem(target: HTMLElement) {
    console.log(
      !isDragging.current,
      !dragging.current,
      !!dragging.current?.contains(target),
      !!currentFlipState.current
    );

    if (
      !isDragging.current ||
      !dragging.current ||
      dragging.current.contains(target) ||
      currentFlipState.current
    )
      return;

    console.log("1");
    let element: HTMLElement | null = target;
    while (element && !element.classList.contains("routine-item")) {
      element = element.parentNode as HTMLElement;
    }
    if (!element) return;
    console.log("2");

    const hoverId = element.id.replace("routine-item-", "");
    const hoverIdx = routineItems.findIndex((x) => x === hoverId);

    const draggingId = dragging.current!.id.replace("routine-item-", "");
    const draggingIdx = routineItems.findIndex((x) => x === draggingId);

    console.log("Hover id", hoverId, hoverIdx);
    console.log("Dragging id", draggingId, draggingIdx);
    console.log("Routine items", routineItems);

    if (
      hoverIdx === undefined ||
      draggingIdx === undefined ||
      hoverIdx === draggingIdx
    )
      return;
    console.log("3");

    currentFlipState.current = Flip.getState(".routine-item:not(.temporary)");
    setRoutineItems(reorderArray(routineItems, draggingIdx, hoverIdx));
  }

  const updateMovablePosition = useCallback(
    contextSafe((x: number, y: number) => {
      if (!movableRef.current) return;
      console.log("updateMovablePosition", x, y);

      gsap.set(movableRef.current, {
        x: `+=${x}`,
        y: `+=${y}`,
      });
    }),
    [contextSafe, movableRef.current]
  );

  const beginDragging = contextSafe((element: HTMLElement) => {
    if (!isDraggingAvailable) return;
    console.log("beginDragging");
    isDraggingAvailable.current = false;

    movableRef.current = element.cloneNode(true) as HTMLElement;
    document.body.appendChild(movableRef.current);
    movableRef.current.classList.add("temporary");

    const rect = element.getBoundingClientRect();
    gsap.set(movableRef.current, {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    });

    element.classList.add("dragging");
    dragging.current = element;
    isDragging.current = true;
  });

  const endDragging = contextSafe((element: HTMLElement) => {
    if (isDraggingAvailable.current || !isDragging.current) return;
    console.log("endDragging");

    isDragging.current = false;
    const rect = preAnimationRect.current ?? element.getBoundingClientRect();

    gsap.to(movableRef.current, {
      x: rect.x,
      y: rect.y,
      left: 0,
      top: 0,
      duration: 0.25,
      onComplete: () => {
        movableRef.current = null;
        isDraggingAvailable.current = true;
        dragging.current = null;
        preAnimationRect.current = undefined;

        routineItemContainerRef.current!.childNodes.forEach((x) => {
          const routineItem = x as HTMLElement;
          if (routineItem.classList.contains("dragging"))
            routineItem.classList.remove("dragging");
        });

        document.body
          .querySelectorAll(".routine-item.temporary")
          .forEach((x) => {
            x.remove();
          });
      },
    });
  });

  return (
    <div
      ref={excludedDivRef}
      className={`create-routine-window ${
        isNewWindowOpen ? "create-routine-window-open" : ""
      }`}
    >
      <div className="create-routine-header">
        <input
          ref={routineTitleRef}
          type="text"
          id="routine-title"
          placeholder="Routine title"
          maxLength={25}
        />
        <button onClick={handleSaveClick} className="create-routine-save">
          Save
        </button>
      </div>
      <div className="create-routine-body" ref={routineItemContainerRef}>
        {routineItems.map((x) => (
          <RoutineItem
            onDrag={updateMovablePosition}
            onDragStart={beginDragging}
            onDragEnd={endDragging}
            onMouseOver={handleHoverOverItem}
            key={x}
            id={x}
            onDelete={() => handleDeleteExercise(x)}
          />
        ))}
        <button
          onClick={handleAddNewExerciseClick}
          className="create-routine-add-exercise"
        >
          Add exercise
        </button>
      </div>
    </div>
  );
}
