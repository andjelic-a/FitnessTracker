import "./CreateRoutine.scss";
import { useRef, useEffect, useState, useCallback, Suspense } from "react";
import RoutineItem, { RoutineItemData } from "./RoutineItem/RoutineItem";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "./ReorderArray";
import { useGSAP } from "@gsap/react";
import useOutsideClick from "../../../Hooks/UseOutsideClick";
import ChooseExercise, {
  ChooseExerciseType,
} from "./ChooseExercise/ChooseExercise";
import { APIResponse } from "../../../Types/Endpoints/ResponseParser";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import { Await } from "react-router-dom";
import { Schema } from "../../../Types/Endpoints/SchemaParser";

gsap.registerPlugin(Flip);
gsap.registerPlugin(Observer);

interface CreateRoutineProps {
  isNewWindowOpen: boolean;
  setIsNewWindowOpen: (isOpen: boolean) => void;
  animationLength?: number;
  safeGuard?: number;
}

export default function CreateRoutine({
  isNewWindowOpen,
  setIsNewWindowOpen,
  animationLength,
  safeGuard,
}: CreateRoutineProps): JSX.Element {
  const [routineItems, setRoutineItems] = useState<ChooseExerciseType[]>([]);

  const createdRoutineItemsRef = useRef<RoutineItemData[]>([]);

  const [isChooseExerciseOpen, setIsChooseExerciseOpen] =
    useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );
  const [previouslyLoadedExercises, setPreviouslyLoadedExercises] = useState<
    APIResponse<"/api/exercise", "get">[]
  >([]);

  const loadingExercises = useRef<Promise<
    APIResponse<"/api/exercise", "get">
  > | null>(null);

  const reachedEnd = useRef(false);
  const lazyLoadedExercises = useRef<APIResponse<"/api/exercise", "get">[]>([]);

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

    const idToIndexMap = new Map<string, number>();
    routineItems.forEach((item, index) => {
      idToIndexMap.set(item.id, index);
    });

    createdRoutineItemsRef.current.sort((a, b) => {
      const indexA = idToIndexMap.get(a.id);
      const indexB = idToIndexMap.get(b.id);

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }

      return 0;
    });
    console.log(createdRoutineItemsRef.current);
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

  const handleAddExercise = (exercises: ChooseExerciseType[]) => {
    setRoutineItems((prevState) => [...prevState, ...exercises]);
  };

  function handleRoutineItemChanged(routineItem: RoutineItemData) {
    const index = createdRoutineItemsRef.current.findIndex(
      (x) => x.id === routineItem.id
    );

    if (index < 0) createdRoutineItemsRef.current.push(routineItem);
    else createdRoutineItemsRef.current[index] = routineItem;
  }

  const handleReplaceExercise = (id: string) => {
    setIsChooseExerciseOpen(true);
    setReplacingExerciseId(id);

    if (excludedDivRef.current) {
      excludedDivRef.current.scrollTo({
        top: 0,
      });
    }
  };

  const handleExerciseChosen = (exercises: ChooseExerciseType[]) => {
    if (replacingExerciseId) {
      const updatedItems = routineItems.slice();
      updatedItems.forEach((x, i) => {
        if (x.id === replacingExerciseId) updatedItems[i] = exercises[0];
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
    if (!routineTitleRef.current?.value) return;

    const newWorkout: Schema<"CreateWorkoutRequestDTO"> = {
      isPublic: true,
      name: routineTitleRef.current?.value,
      description: "",
      sets: createdRoutineItemsRef.current
        .flatMap((routineItem) =>
          routineItem.sets.map((set) => ({
            exerciseId: routineItem.exercise.id,
            set: set,
          }))
        )
        .map((x) => {
          let repRange = x.set.repRange
            .trim()
            .split("-")
            .map((x) => parseInt(x));

          if (repRange.length === 1)
            repRange = x.set.repRange
              .trim()
              .split(" ")
              .map((x) => parseInt(x));

          if (repRange.length === 1) repRange = [repRange[0], repRange[0]];

          const enumValue = ["1", "w", "d", "f"].indexOf(
            x.set.selectedIcon ?? "1"
          );

          return {
            exerciseId: x.exerciseId,
            bottomRepRange: repRange[0],
            topRepRange: repRange[1],
            intensity: x.set.rir,
            type: enumValue as Schema<"SetType">,
          };
        }),
    };

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

  async function getExercises(): Promise<
    APIResponse<"/api/exercise", "get">[]
  > {
    if (previouslyLoadedExercises.length > 0) return previouslyLoadedExercises;

    if (loadingExercises.current) return [await loadingExercises.current];

    const newExercises = await getMoreExercises(false);
    if (!newExercises) return [];

    setPreviouslyLoadedExercises([newExercises]);
    return [newExercises];
  }

  async function getMoreExercises(
    lazyLoading: boolean
  ): Promise<APIResponse<"/api/exercise", "get"> | null> {
    if (reachedEnd.current) return null;

    const okResultCount =
      previouslyLoadedExercises.filter((x) => x.code === "OK").length +
      lazyLoadedExercises.current.length;

    console.log(okResultCount * 10);

    loadingExercises.current ??= sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: {
        limit: 10,
        offset: okResultCount * 10,
      },
    }).then((x) => {
      loadingExercises.current = null;
      if (x.code === "OK" && x.content.length < 10) reachedEnd.current = true;
      if (lazyLoading && x.code === "OK") lazyLoadedExercises.current.push(x);

      return x;
    });

    return loadingExercises.current;
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
            {(exercises: APIResponse<"/api/exercise", "get">[]) => {
              return (
                <ChooseExercise
                  onClose={() => {
                    setIsChooseExerciseOpen(false);
                    setPreviouslyLoadedExercises([
                      ...previouslyLoadedExercises,
                      ...lazyLoadedExercises.current,
                    ]);

                    lazyLoadedExercises.current = [];
                  }}
                  onAddExercise={handleExerciseChosen}
                  isReplaceMode={!!replacingExerciseId}
                  exercises={exercises
                    .filter((x) => x.code === "OK")
                    .flatMap((x) => x.content)}
                  onRequireLazyLoad={async () => {
                    console.log("lazy load");
                    const newExercises = getMoreExercises(true).then((x) =>
                      x?.code === "OK" ? x?.content ?? [] : []
                    );
                    return newExercises;
                  }}
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
            onChange={handleRoutineItemChanged}
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
