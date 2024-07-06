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

  const dragging = useRef<{ element: HTMLElement; id: string } | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const movableRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!currentFlipState.current) return;

    Flip.from(currentFlipState.current, {
      onComplete: () => {
        currentFlipState.current = null;
      },
    });
  }, [routineItems]);

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
    setRoutineItems((prevState) => prevState.filter((item) => item !== id));
  };

  const handleAddNewExerciseClick = () => {
    const id = uuidv4();
    const newItem = id;
    setRoutineItems((prevState) => [...prevState, newItem]);
  };

  function onHoverOver(target: HTMLElement) {
    if (
      !dragging.current ||
      dragging.current?.element.contains(target as Node) ||
      currentFlipState.current
    )
      return;
    let element: HTMLElement | null = target as HTMLElement;
    while (element && !element.classList.contains("routine-item")) {
      element = element.parentNode as HTMLElement;
    }

    if (!element) return;

    const hoverId = element.id.replace("routine-item-", "");
    const hoverIdx = routineItems.findIndex((x) => x === hoverId);

    const draggingId = dragging.current!.id;
    const draggingIdx = routineItems.findIndex((x) => x === draggingId);

    if (hoverIdx === draggingIdx) return;

    currentFlipState.current = Flip.getState(".routine-item:not(.temporary)");
    setRoutineItems(reorderArray(routineItems, draggingIdx, hoverIdx));
  }

  const handleSaveClick = () => {
    setRoutineItems([]);
    setIsNewWindowOpen(false);
  };

  const { contextSafe } = useGSAP();

  const setTranslation = useCallback(
    contextSafe((x: number, y: number) => {
      if (!movableRef.current) return;

      gsap.set(movableRef.current, {
        x: `+=${x}`,
        y: `+=${y}`,
      });
    }),
    [contextSafe, movableRef.current]
  );

  const beginDragging = contextSafe((rect: DOMRect) => {
    if (!movableRef.current) return;

    // setIsDraggingAvailable(false);
    gsap.set(dragging.current!.element, {
      alpha: 0,
      pointerEvents: "none",
    });

    movableRef.current.classList.add("temporary");
    gsap.set(movableRef.current, {
      position: "absolute",
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      pointerEvents: "none",
      zIndex: 1000,
      opacity: 1,
    });
  });

  const endDragging = contextSafe((rect: DOMRect) => {
    if (!movableRef.current) return;

    gsap.to(movableRef.current, {
      x: rect.x,
      y: rect.y,
      left: 0,
      top: 0,
      duration: 0.25,
      onComplete: () => {
        gsap.set(dragging.current!.element, {
          alpha: 1,
          pointerEvents: "auto",
        });

        movableRef.current!.remove();
        movableRef.current = null;
        dragging.current = null;
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
      <div className="create-routine-body">
        {routineItems.map((x) => (
          <RoutineItem
            onDrag={setTranslation}
            onDragStart={(element) => {
              if (dragging.current) return;

              dragging.current = {
                element,
                id: element.id.replace("routine-item-", ""),
              };

              movableRef.current = element.cloneNode(true) as HTMLElement;
              document.body.appendChild(movableRef.current);

              beginDragging(element.getBoundingClientRect());
            }}
            onDragEnd={(element) => {
              endDragging(element.getBoundingClientRect());
            }}
            onMouseOver={(element) => onHoverOver(element)}
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
