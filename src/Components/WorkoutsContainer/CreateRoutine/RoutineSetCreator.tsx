import "./CreateRoutine.scss";
import { useRef, useEffect, useState, useCallback } from "react";
import RoutineItem, { RoutineItemData } from "./RoutineItem/RoutineItem";
import gsap from "gsap";
import Flip from "gsap/Flip";
import Observer from "gsap/Observer";
import reorderArray from "./ReorderArray";
import { useGSAP } from "@gsap/react";
import ChooseExerciseWindow, {
  ChooseExerciseData,
  ChooseExerciseFilters,
} from "./ChooseExercise/ChooseExercise";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../../Data/SendAPIRequest";
import Async from "../../Async/Async";
import ChooseExerciseSkeleton from "./ChooseExercise/ChooseExerciseSkeleton";
import { v4 } from "uuid";

gsap.registerPlugin(Flip);
gsap.registerPlugin(Observer);

type RoutineSetCreatorProps = {
  onSetsChange: (sets: RoutineItemData[]) => void;
  onStartChoosingExercise?: () => void;
  onConfirmExerciseSelection?: () => void;
  animationLength?: number;
  safeGuard?: number;
};

export default function RoutineSetCreator({
  animationLength,
  safeGuard,
  onConfirmExerciseSelection,
  onStartChoosingExercise,
  onSetsChange,
}: RoutineSetCreatorProps) {
  const { contextSafe } = useGSAP();

  const [routineItems, setRoutineItems] = useState<ChooseExerciseData[]>([]);
  const [isChoosingExercise, setIsChoosingExercise] = useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );
  const [previouslyLoadedExercises, setPreviouslyLoadedExercises] = useState<
    Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  const loadingExercises = useRef<Promise<
    Schema<"SimpleExerciseResponseDTO">[] | null
  > | null>(null);
  const createdRoutineItemsRef = useRef<RoutineItemData[]>([]);
  const reachedEnd = useRef(false);
  const lazyLoadedExercises = useRef<Schema<"SimpleExerciseResponseDTO">[]>([]);
  const dragging = useRef<HTMLElement | null>(null);
  const currentFlipState = useRef<Flip.FlipState | null>(null);
  const currentFlipTimeline = useRef<gsap.core.Timeline | null>(null);
  const movableRef = useRef<HTMLElement | null>(null);
  const isDraggingAvailable = useRef(true);
  const routineItemContainerRef = useRef<HTMLDivElement>(null);
  const isMoveAvailable = useRef(true);
  const addExerciseButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersRef = useRef<ChooseExerciseFilters | null>(null);

  useEffect(() => {
    playReorderAnimation();

    //Sort data according to their respective elements
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
    onSetsChange(createdRoutineItemsRef.current);
  }, [routineItems]);

  function handleAddExerciseSetBtnClick() {
    setIsChoosingExercise(true);
    onStartChoosingExercise?.();
  }
  const handleExerciseChosen = (
    selected:
      | Schema<"SimpleExerciseResponseDTO">
      | Schema<"SimpleExerciseResponseDTO">[]
  ) => {
    if (!replacingExerciseId && Array.isArray(selected)) {
      setRoutineItems((prevState) => [
        ...prevState,
        ...selected.map((x) => ({ exercise: x, id: v4() })),
      ]);
      return;
    }

    setReplacingExerciseId(null);
    setRoutineItems((prev) => {
      const index = prev.findIndex((x) => x.id === replacingExerciseId);
      if (index >= 0 && !Array.isArray(selected))
        prev[index].exercise = selected;

      return prev;
    });
  };
  function handleExerciseSearch(filters: ChooseExerciseFilters) {
    reachedEnd.current = false;
    filtersRef.current = filters;
    loadingExercises.current = null;

    setPreviouslyLoadedExercises([]);
    lazyLoadedExercises.current = [];
    getMoreExercises(false, 0).then((x) => {
      if (x) setPreviouslyLoadedExercises(x);
    });
    lazyLoadedExercises.current = [];
  }

  async function getInitialExercises(): Promise<
    Schema<"SimpleExerciseResponseDTO">[]
  > {
    if (previouslyLoadedExercises.length > 0) return previouslyLoadedExercises;

    if (loadingExercises.current) return (await loadingExercises.current) ?? [];

    const newExercises = await getMoreExercises(false);
    if (!newExercises) return [];

    setPreviouslyLoadedExercises(newExercises);
    return newExercises;
  }

  async function getMoreExercises(
    lazyLoading: boolean,
    offset?: number
  ): Promise<Schema<"SimpleExerciseResponseDTO">[] | null> {
    if (reachedEnd.current) return null;

    loadingExercises.current ??= sendAPIRequest("/api/exercise", {
      method: "get",
      parameters: {
        limit: 10,
        offset:
          offset ??
          previouslyLoadedExercises.length + lazyLoadedExercises.current.length,
        name: filtersRef.current?.name ?? undefined,
        muscleGroupId: filtersRef.current?.muscleGroupId ?? undefined,
        equipmentId: filtersRef.current?.equipmentId ?? undefined,
      },
    }).then((x) => {
      loadingExercises.current = null;
      if (x.code !== "OK") return null;

      if (x.content.length < 10) reachedEnd.current = true;
      if (lazyLoading) lazyLoadedExercises.current.push(...x.content);

      return x.content;
    });

    return loadingExercises.current;
  }
  function handleReplaceExerciseRequest(id: string) {
    setIsChoosingExercise(true);
    setReplacingExerciseId(id);
    onStartChoosingExercise?.();
  }

  function handleRoutineItemChanged(routineItem: RoutineItemData) {
    const index = createdRoutineItemsRef.current.findIndex(
      (x) => x.id === routineItem.id
    );

    if (index < 0) createdRoutineItemsRef.current.push(routineItem);
    else createdRoutineItemsRef.current[index] = routineItem;
  }
  const handleDeleteExercise = (id: string) =>
    void setRoutineItems((prev) => prev.filter((item) => item.id !== id));

  //#region Routine item drag and drop logic / animations
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const touch = e.touches[0];
      let element = document.elementFromPoint(touch.clientX, touch.clientY);

      while (element && !element.classList.contains("routine-item"))
        element = element.parentElement;

      if (element) handleHoverOverItem(element as HTMLElement);
    },
    [handleHoverOverItem]
  );

  useEffect(() => {
    document.addEventListener("touchmove", handleTouchMove);
    return () =>
      void document.removeEventListener("touchmove", handleTouchMove);
  }, [handleTouchMove]);

  const playReorderAnimation = contextSafe(() => {
    if (!currentFlipState.current) return;

    isMoveAvailable.current = false;
    setTimeout(() => void (isMoveAvailable.current = true), safeGuard ?? 150);

    currentFlipTimeline.current = Flip.from(currentFlipState.current, {
      duration: animationLength ?? 0.3,
      onComplete: () => {
        currentFlipState.current = null;
        currentFlipTimeline.current = null;
      },
    });
  });

  function handleHoverOverItem(target: HTMLElement) {
    if (
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

    if (hoverIdx < 0 || draggingIdx < 0 || hoverIdx === draggingIdx) return;

    if (currentFlipTimeline.current) currentFlipTimeline.current.kill();

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
  });

  const endDragging = contextSafe((element: HTMLElement) => {
    if (!dragging.current) return;
    dragging.current = null;

    const rect = element.getBoundingClientRect();
    gsap.to(movableRef.current, {
      x: rect.x - +gsap.getProperty(element, "x"),
      y: rect.y - +gsap.getProperty(element, "y"),
      left: 0,
      top: 0,
      duration: 0.25,
      onComplete: () => {
        routineItemContainerRef.current!.childNodes.forEach(
          (x) => void (x as HTMLElement).classList.remove("dragging")
        );

        document.body
          .querySelectorAll(".routine-item.temporary")
          .forEach((x) => {
            x.remove();
          });
      },
    });

    isDraggingAvailable.current = true;
    movableRef.current = null;
  });
  //#endregion
  async function handleMuscleGroupRequest(): Promise<
    Schema<"SimpleMuscleGroupResponseDTO">[]
  > {
    return sendAPIRequest("/api/musclegroup", {
      method: "get",
      parameters: {},
    }).then((x) => (x.code === "OK" ? x.content : []));
  }

  async function handleEquipmentRequest(): Promise<
    Schema<"SimpleEquipmentResponseDTO">[]
  > {
    return sendAPIRequest("/api/equipment", {
      method: "get",
      parameters: {},
    }).then((x) => (x.code === "OK" ? x.content : []));
  }
  return (
    <>
      {isChoosingExercise && (
        <Async
          await={getInitialExercises()}
          skeleton={<ChooseExerciseSkeleton />}
        >
          {(exercises) => {
            return (
              <ChooseExerciseWindow
                onSearch={handleExerciseSearch}
                onClose={() => {
                  setIsChoosingExercise(false);
                  onConfirmExerciseSelection?.();

                  setReplacingExerciseId(null);
                  setPreviouslyLoadedExercises([
                    ...previouslyLoadedExercises,
                    ...lazyLoadedExercises.current,
                  ]);

                  lazyLoadedExercises.current = [];
                }}
                onConfirmSelection={handleExerciseChosen}
                singleMode={!!replacingExerciseId}
                exercises={exercises}
                onRequestLazyLoad={async () => getMoreExercises(true)}
                onRequestEquipment={handleEquipmentRequest}
                onRequestMuscleGroups={handleMuscleGroupRequest}
              />
            );
          }}
        </Async>
      )}

      <div ref={routineItemContainerRef} className="set-creator-container">
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
            onRequestExerciseReplace={handleReplaceExerciseRequest}
          />
        ))}

        <button
          onClick={handleAddExerciseSetBtnClick}
          className="create-routine-add-exercise"
          ref={addExerciseButtonRef}
        >
          Add exercise
        </button>
      </div>
    </>
  );
}
