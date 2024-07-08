import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import RoutineItem from "./RoutineItem/RoutineItem";
import "./CreateRoutine.scss";
import { v4 as uuidv4 } from "uuid";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "./ReorderArray";
import { useGSAP } from "@gsap/react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import ChooseExercise from "./ChooseExercise/ChooseExercise";
import { APIResponse } from "../../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Await } from "react-router-dom";

gsap.registerPlugin(Flip);
gsap.registerPlugin(Observer);

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
  animationLength?: number;
  safeGuard?: number;
}

type Exercise = string;

/**
 * Renders a create routine component.
 *
 * @param {CreateRoutineProps} props - The component props.
 * @param {boolean} props.isNewWindowOpen - Indicates if the new window is open.
 * @param {Function} props.setIsNewWindowOpen - Function to set the isNewWindowOpen state.
 * @param {number} [props.animationLength] - Length of each animation triggered when dragging a routine item.
 * @param {number} [props.safeGuard] - Duration of a safe guard which gets activated when a user begins dragging, this prevents routine items from teleporting.
 * @return {JSX.Element} The rendered create routine component.
 */
export default function CreateRoutine({
  isNewWindowOpen,
  setIsNewWindowOpen,
  animationLength,
  safeGuard,
}: CreateRoutineProps): JSX.Element {
  const [routineItems, setRoutineItems] = useState<
    {
      id: string;
      exercise: Exercise;
    }[]
  >([]);

  const [isChooseExerciseOpen, setIsChooseExerciseOpen] =
    useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );
  const [previouslyLoadedExercises, setPreviouslyLoadedExercises] =
    useState<APIResponse<"/api/exercise", "get"> | null>(null);

  const excludedDivRef = useRef<HTMLDivElement | null>(null);
  const routineTitleRef = useRef<HTMLInputElement | null>(null);

  const { contextSafe } = useGSAP();
  const dragging = useRef<HTMLElement | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const currentFlipTimeline = useRef<gsap.core.Timeline | null>(null);
  const movableRef = useRef<HTMLElement | null>(null);
  const isDraggingAvailable = useRef(true);
  const isDragging = useRef(false);
  const routineItemContainerRef = useRef<HTMLDivElement>(null);
  const isMoveAvailable = useRef(true);

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
    playReorderAnimation();
  }, [routineItems]);

  useOutsideClick(excludedDivRef, () => {
    setIsNewWindowOpen(false);
    if (routineTitleRef.current) routineTitleRef.current.value = "";
  });

  const playReorderAnimation = contextSafe(() => {
    if (!currentFlipState.current) return;

    isMoveAvailable.current = false;
    setTimeout(() => void (isMoveAvailable.current = true), safeGuard ?? 150);

    currentFlipTimeline.current?.kill();
    currentFlipTimeline.current = Flip.from(currentFlipState.current, {
      duration: animationLength ?? 0.3,
      absolute: false,
      onComplete: () => {
        currentFlipState.current = null;
        currentFlipTimeline.current = null;
      },
    });

    return;
  });

  const handleAddNewExerciseClick = () => {
    setIsChooseExerciseOpen(true);

    if (excludedDivRef.current) {
      excludedDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleAddExercise = (exercises: string[]) => {
    const newItems = exercises.map((exercise) => {
      const id = uuidv4();
      return {
        id,
        exercise,
        element: (
          <RoutineItem
            key={id}
            exercise={exercise}
            onDelete={() => handleDeleteExercise(id)}
            onReplace={() => handleReplaceExercise(id)}
            id={id}
          />
        ),
      };
    });
    setRoutineItems((prevState) => [...prevState, ...newItems]);
  };

  const handleReplaceExercise = (id: string) => {
    setIsChooseExerciseOpen(true);
    setReplacingExerciseId(id);

    if (excludedDivRef.current) {
      excludedDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleExerciseChosen = (exercises: string[]) => {
    if (replacingExerciseId) {
      const updatedItems = routineItems.map((item) => {
        if (item.id === replacingExerciseId) {
          return {
            ...item,
            exercise: exercises[0],
            element: (
              <RoutineItem
                key={item.id}
                exercise={exercises[0]}
                onDelete={() => handleDeleteExercise(item.id)}
                onReplace={() => handleReplaceExercise(item.id)}
                id={item.id}
              />
            ),
          };
        }
        return item;
      });
      setRoutineItems(updatedItems);
      setReplacingExerciseId(null);
      setIsChooseExerciseOpen(false);
    } else {
      handleAddExercise(exercises);
    }
  };

  const handleDeleteExercise = (id: string) => {
    setRoutineItems((prevState) => prevState.filter((item) => item.id !== id));
  };

  const handleSaveClick = () => {
    setRoutineItems([]);
    setIsNewWindowOpen(false);
    setIsChooseExerciseOpen(false);
  };

  function handleHoverOverItem(target: HTMLElement) {
    if (
      !isDragging.current ||
      !dragging.current ||
      dragging.current.contains(target) ||
      !isMoveAvailable.current
    )
      return;

    let element: HTMLElement | null = target;
    while (element && !element.classList.contains("routine-item")) {
      element = element.parentNode as HTMLElement;
    }
    if (!element) return;

    const hoverId = element.id.replace("routine-item-", "");
    const hoverIdx = routineItems.findIndex((x) => x.id === hoverId);

    const draggingId = dragging.current!.id.replace("routine-item-", "");
    const draggingIdx = routineItems.findIndex((x) => x.id === draggingId);

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
    currentFlipState.current = Flip.getState(
      routineItemContainerRef.current!.children
    );

    setRoutineItems(reorderArray(routineItems, draggingIdx, hoverIdx));
  }

  const updateMovablePosition = useCallback(
    contextSafe((x: number, y: number) => {
      if (!movableRef.current) return;

      gsap.set(movableRef.current, {
        x: `+=${x}`,
        y: `+=${y}`,
      });
    }),
    [contextSafe, movableRef.current]
  );

  const beginDragging = contextSafe((element: HTMLElement) => {
    if (!isDraggingAvailable) return;
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

    isDragging.current = false;
    const rect = element.getBoundingClientRect();

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

  async function getExercises(): Promise<APIResponse<"/api/exercise", "get">> {
    let exercises: APIResponse<"/api/exercise", "get"> | null =
      previouslyLoadedExercises;

    if (exercises) return exercises;
    console.log("loading");

    exercises = await sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: { limit: 10 },
    });

    setPreviouslyLoadedExercises(exercises);
    return exercises;
  }

  return (
    <div
      ref={excludedDivRef}
      className={`create-routine-window ${
        isNewWindowOpen ? "create-routine-window-open" : ""
      } ${isChooseExerciseOpen ? "no-scroll" : ""}`}
    >
      {isChooseExerciseOpen && (
        <Suspense fallback={null}>
          <Await resolve={getExercises()}>
            {(exercises: APIResponse<"/api/exercise", "get">) => {
              if (exercises.code !== "OK") return null;

              return (
                <ChooseExercise
                  onClose={() => setIsChooseExerciseOpen(false)}
                  onAddExercise={handleExerciseChosen}
                  isReplaceMode={!!replacingExerciseId}
                  preLoadedExercises={exercises.content}
                />
              );
            }}
          </Await>
        </Suspense>
      )}
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
            key={x.id}
            id={x.id}
            onDelete={() => handleDeleteExercise(x.id)}
            exercise={x.exercise}
            onReplace={handleReplaceExercise}
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
