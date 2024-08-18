import React, { useRef, useEffect, useState } from "react";
import WorkoutItem, {
  WorkoutItemData,
} from "../CreateWorkout/WorkoutItem/WorkoutItem";
import ChooseExerciseWindow, {
  ChooseExerciseFilters,
} from "../CreateWorkout/ChooseExercise/ChooseExercise";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import Async from "../Async/Async";
import ChooseExerciseSkeleton from "../CreateWorkout/ChooseExercise/ChooseExerciseSkeleton";
import { v4 } from "uuid";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
import { DndContext } from "@dnd-kit/core";

type WorkoutSetCreatorProps = {
  onSetsChange: (sets: WorkoutItemData[]) => void;
  onStartChoosingExercise?: () => void;
  onConfirmExerciseSelection?: () => void;
  createdSets: WorkoutItemData[];
  setCreatedSets: React.Dispatch<
    React.SetStateAction<WorkoutItemData[] | null>
  >;
};

export default function WorkoutSetCreator({
  onConfirmExerciseSelection,
  onStartChoosingExercise,
  onSetsChange,
  createdSets,
  setCreatedSets,
}: WorkoutSetCreatorProps) {
  const createdSetsRef = useRef<WorkoutItemData[]>([]);

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
  const reachedEnd = useRef(false);
  const lazyLoadedExercises = useRef<Schema<"SimpleExerciseResponseDTO">[]>([]);
  const workoutItemContainerRef = useRef<HTMLDivElement>(null);
  const addExerciseButtonRef = useRef<HTMLButtonElement | null>(null);
  const filtersRef = useRef<ChooseExerciseFilters | null>(null);

  useEffect(() => {
    //Sort data according to their respective elements
    fuckYou();
  }, [createdSets]);

  function fuckYou() {
    const idToIndexMap = new Map<string, number>();
    createdSets.forEach((item, index) => {
      idToIndexMap.set(item.id, index);
    });

    createdSetsRef.current.sort((a, b) => {
      const indexA = idToIndexMap.get(a.id);
      const indexB = idToIndexMap.get(b.id);

      if (indexA !== undefined && indexB !== undefined) {
        return indexA - indexB;
      }

      return 0;
    });
    onSetsChange(createdSetsRef.current);
  }

  //#region Exercise Selection //TODO: Move to a separate component
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
      setCreatedSets((prevState) => [
        ...(prevState ?? []),
        ...selected.map<WorkoutItemData>((x) => ({
          exercise: x,
          id: v4(),
          sets: [
            {
              id: v4(),
              idx: 0,
              isDropdownOpen: false,
              repRange: "0",
              rir: -1,
              selectedIcon: "1",
            },
          ],
        })),
      ]);
      return;
    }

    setReplacingExerciseId(null);
    setCreatedSets((prev) => {
      if (!prev) return prev;

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
  //#endregion

  function handleWorkoutItemChanged(workoutItem: WorkoutItemData) {
    const index = createdSetsRef.current.findIndex(
      (x) => x.id === workoutItem.id
    );

    if (index < 0) createdSetsRef.current.push(workoutItem);
    else createdSetsRef.current[index] = workoutItem;
    fuckYou();
    // setCreatedSets(createdSetsRef.current);
  }

  const handleDeleteExercise = (id: string) => {
    createdSetsRef.current = createdSetsRef.current.filter(
      (item) => item.id !== id
    );
    fuckYou();
    setCreatedSets(createdSetsRef.current);
  };

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

      <DndContext
        onDragEnd={(x) => {
          console.log(x);
        }}
      >
        <div ref={workoutItemContainerRef} className="set-creator-container">
          {createdSets.map((x) => (
            <WorkoutItem
              onChange={handleWorkoutItemChanged}
              key={x.id}
              workoutItem={x}
              onDelete={() => handleDeleteExercise(x.id)}
              onRequestExerciseReplace={handleReplaceExerciseRequest}
            />
          ))}

          <Droppable id="droppable-1" />

          <Draggable id="draggable-1" />

          <button
            onClick={handleAddExerciseSetBtnClick}
            className="add-exercise-btn"
            ref={addExerciseButtonRef}
          >
            Add exercise
          </button>
        </div>
      </DndContext>
    </>
  );
}
