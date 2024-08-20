import "./WorkoutItem.scss";
import { useContext, useMemo, useState } from "react";
import Icon from "../../Icon/Icon.tsx";
import { Schema } from "../../../Types/Endpoints/SchemaParser.ts";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { v4 } from "uuid";
import WorkoutSetDisplay from "./WorkoutSetDisplay.tsx";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { createPortal } from "react-dom";
import StaticWorkoutSetDisplay from "./StaticWorkoutSetDisplay.tsx";

export type Set = {
  id: string;
  rir: number;
  repRange: string;
  type: SetType;
};

export type SetType = "1" | "w" | "d" | "f";

export type WorkoutItemData = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Set[];
  id: string;
};

type WorkoutItemProps = {
  onRequestExerciseReplace: (id: string) => void;
  workoutItem: WorkoutItemData;
};

export default function WorkoutItem({
  onRequestExerciseReplace,
  workoutItem,
}: WorkoutItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: workoutItem.id,
    data: {
      type: "WorkoutItem",
      workoutItem,
    },
  });

  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);
  const sets = useMemo(
    () =>
      currentSetsContext.currentSets
        .filter((x) => x.id === workoutItem.id)
        .flatMap((x) => x.sets),
    [currentSetsContext.currentSets]
  );

  const addSet = () => {
    const newSet: Set = {
      id: v4(),
      rir: 0,
      repRange: "0",
      type: "1",
    };

    handleSetsChanged([...sets, newSet]);
  };

  const handleSetsChanged = (newSets: Set[]) => {
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === workoutItem.id);
      if (index >= 0) prev[index].sets = newSets;

      return prev.slice();
    });
  };

  /*   const handleDelete = () => {
    currentSetsContext.setCurrentSets((prev) =>
      prev.filter((item) => item.id !== workoutItem.id).slice()
    );
  }; */

  const [draggingSet, setDraggingSet] = useState<{
    set: Set;
    index: number;
  } | null>(null);

  //TODO: Add a collapse/expand button and collapse all workout items before initializing drag
  //TODO: Add drag and drop to reorder sets
  //TODO: Add a copy / duplicate button to sets
  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={({
        active: {
          data: { current: data },
        },
      }) => {
        if (!data || data.type !== "Set") return;

        setDraggingSet({
          set: data.set,
          index: data.index,
        });
      }}
      onDragEnd={({ active, over }) => {
        if (!over) return;

        const activeId = active.data.current?.set.id;
        const overId = over.data.current?.set.id;

        if (!activeId || !overId || activeId === overId) return;

        const activeIndex = sets.findIndex((x) => x.id === activeId);
        const overIndex = sets.findIndex((x) => x.id === overId);

        if (activeIndex < 0 || overIndex < 0) return;
        console.log("a");

        handleSetsChanged(arrayMove(sets, activeIndex, overIndex));
      }}
    >
      <div
        id={`workout-item-${workoutItem.id}`}
        className="workout-item"
        ref={setNodeRef}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
          opacity: isDragging ? 0.5 : 1,
        }}
      >
        <div className="workout-item-header">
          <div className="exercise">
            <img
              src={workoutItem.exercise.image}
              alt={`Image of an exercise: ${workoutItem.exercise.name}`}
              className="exercise-image"
            />

            <button
              onClick={() => void onRequestExerciseReplace(workoutItem.id)}
              className="exercise-name"
            >
              {workoutItem.exercise.name}
            </button>
          </div>

          <div className="drag-handle" {...listeners} {...attributes}>
            <Icon name="grip-vertical" />
          </div>
        </div>

        <div className="workout-item-body">
          <div className="exercise-set">
            <div className="set-information-header-container">
              <p hidden></p>
              <p>SET</p>
              <p>RiR</p>
              <p>VOLUME</p>
            </div>

            <SortableContext
              strategy={verticalListSortingStrategy}
              items={sets.map((x) => x.id)}
            >
              {sets.map((set, index) => (
                <WorkoutSetDisplay
                  key={set.id}
                  set={set}
                  index={index}
                  itemId={workoutItem.id}
                />
              ))}
            </SortableContext>

            <button
              className="add-set-btn"
              onClick={addSet}
              aria-describedby="add-set-text"
            >
              <Icon className="add-set-icon" name="plus" />

              <p
                id="add-set-text"
                className="accessibility-only"
                aria-hidden={false}
              >
                Add Set
              </p>
            </button>
          </div>
        </div>
      </div>

      {createPortal(
        <DragOverlay
          dropAnimation={{
            ...defaultDropAnimation,
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: "0.5",
                },
              },
            }),
          }}
        >
          {draggingSet && (
            <StaticWorkoutSetDisplay
              index={draggingSet.index}
              set={draggingSet.set}
            />
          )}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
}
