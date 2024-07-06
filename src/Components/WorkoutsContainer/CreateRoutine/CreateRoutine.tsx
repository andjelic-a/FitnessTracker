import { useRef, useEffect, useState } from "react";
import RoutineItem from "./RoutineItem/RoutineItem";
import "./CreateRoutine.scss";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "./ReorderArray";

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
  const preDragState = useRef<Flip.FlipState | null>(null);

  useEffect(() => {
    if (!preDragState.current) return;

    Flip.from(preDragState.current, {
      onStart: () => {},
      onComplete: () => {
        preDragState.current = null;
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
    console.log("handleDeleteExercise");
    setRoutineItems((prevState) => prevState.filter((item) => item !== id));
  };

  const handleAddNewExerciseClick = () => {
    const id = uuidv4();
    const newItem = id;
    setRoutineItems((prevState) => [...prevState, newItem]);
  };

  function onDragOver(target: HTMLElement) {
    {
      console.log(
        "onDragOver",
        dragging.current !== null ? "dragging" : "not dragging",
        preDragState.current === null
      );

      if (
        !dragging.current ||
        dragging.current?.element.contains(target as Node) ||
        preDragState.current
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

      console.log(element);
      console.log(dragging.current);

      console.log(hoverId, hoverIdx);
      console.log(draggingId, draggingIdx);

      console.log(routineItems);

      if (hoverIdx === draggingIdx) return;

      console.log("should reorder");
      preDragState.current = Flip.getState(".routine-item");
      setRoutineItems(reorderArray(routineItems, draggingIdx, hoverIdx));
    }
  }

  const handleSaveClick = () => {
    console.log("handleSaveClick");
    setRoutineItems([]);
    setIsNewWindowOpen(false);
  };

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
            onDrag={() => {
              // console.log("onDrag");
              // console.log(x);
              // setTranslation({ x: xDelta, y: yDelta });
            }}
            onDragStart={(e) => {
              console.log("onDragStart");
              const element = e.target as HTMLElement;
              console.log(e.target);
              dragging.current = {
                element,
                id: element.id.replace("routine-item-", ""),
              };
              gsap.set(element, {
                opacity: 0,
              });
            }}
            onDragEnd={(e) => {
              console.log("onDragEnd");
              const element = e.target as HTMLElement;
              dragging.current = null;
              gsap.set(element, {
                opacity: 1,
              });
            }}
            onDragOver={(e) => onDragOver(e.target as HTMLElement)}
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
