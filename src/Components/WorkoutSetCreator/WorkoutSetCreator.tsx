import "./WorkoutSetCreator.scss";
import { useContext, useState, useMemo } from "react";
import WorkoutItem, { WorkoutItemData } from "./WorkoutItem/WorkoutItem";
import {
  closestCenter,
  defaultDropAnimation,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import CurrentEditingWorkoutSetsContext from "../../Contexts/CurrentEditingWorkoutSetsContext";
import ExerciseSelector from "../ExerciseSelector/ExerciseSelector";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { v4 } from "uuid";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import WorkoutItemDragOverlay from "./WorkoutItem/WorkoutItemDragOverlay";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

type WorkoutSetCreatorProps = {
  onOverlayOpen: () => void;
  onOverlayClose: () => void;
};

export default function WorkoutSetCreator({
  onOverlayOpen,
  onOverlayClose,
}: WorkoutSetCreatorProps) {
  const [isChoosingExercise, setIsChoosingExercise] = useState<boolean>(false);
  const [replacingExerciseId, setReplacingExerciseId] = useState<string | null>(
    null
  );

  function handleAddExerciseSetBtnClick() {
    onOverlayOpen();
    setIsChoosingExercise(true);
  }

  const handleExerciseChosen = (
    selected:
      | Schema<"SimpleExerciseResponseDTO">
      | Schema<"SimpleExerciseResponseDTO">[]
  ) => {
    onOverlayClose();

    if (!replacingExerciseId && Array.isArray(selected)) {
      currentSetsContext.setCurrentSets((prevState) => [
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
              type: "1",
            },
          ],
        })),
      ]);
      return;
    }

    setReplacingExerciseId(null);
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === replacingExerciseId);
      if (index >= 0 && !Array.isArray(selected))
        prev[index].exercise = selected;

      return prev.slice();
    });
  };

  function handleReplaceExerciseRequest(id: string) {
    onOverlayOpen();
    setIsChoosingExercise(true);
    setReplacingExerciseId(id);
  }

  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  const exerciseSelectorPortalNode = useMemo(() => createHtmlPortalNode(), []);
  const exerciseSelectorMemo = useMemo(
    () => (
      <ExerciseSelector
        onClose={() => {
          onOverlayClose();
          setIsChoosingExercise(false);
          setReplacingExerciseId(null);
        }}
        onConfirmSelection={handleExerciseChosen}
        singleMode={!!replacingExerciseId}
      />
    ),
    [replacingExerciseId, handleExerciseChosen]
  );

  const [draggingItem, setDraggingItem] = useState<WorkoutItemData | null>(
    null
  );

  return (
    <>
      <InPortal
        node={exerciseSelectorPortalNode}
        children={exerciseSelectorMemo}
      />

      {isChoosingExercise && <OutPortal node={exerciseSelectorPortalNode} />}

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[snapCenterToCursor]}
        onDragStart={(x) => {
          if (x.active.data.current?.type === "WorkoutItem")
            setDraggingItem(x.active.data.current.workoutItem);
        }}
        onDragEnd={({ active, over }) => {
          setTimeout(() => {
            setDraggingItem(null);
          }, 150);

          if (!over) return;

          const activeId = active.data.current?.workoutItem.id;
          const overId = over.data.current?.workoutItem.id;

          if (!activeId || !overId || activeId === overId) return;

          currentSetsContext.setCurrentSets((prev) => {
            const activeIndex = prev.findIndex((x) => x.id === activeId);
            const overIndex = prev.findIndex((x) => x.id === overId);
            return arrayMove(prev, activeIndex, overIndex);
          });
        }}
      >
        <div className="set-creator-container">
          <SortableContext
            strategy={rectSortingStrategy}
            items={currentSetsContext.currentSets.map((x) => x.id)}
          >
            {currentSetsContext.currentSets.map((x) => (
              <WorkoutItem
                forceCollapse={!!draggingItem}
                key={x.id}
                workoutItem={x}
                onRequestExerciseReplace={handleReplaceExerciseRequest}
              />
            ))}
          </SortableContext>

          <button
            onClick={handleAddExerciseSetBtnClick}
            className="add-exercise-btn"
          >
            Add exercise
          </button>
        </div>

        {createPortal(
          <DragOverlay
            className="drag-overlay"
            dropAnimation={{
              ...defaultDropAnimation,
              duration: 150,
              sideEffects: defaultDropAnimationSideEffects({
                styles: {
                  active: {
                    opacity: "0.5",
                  },
                },
              }),
            }}
          >
            {draggingItem && (
              <WorkoutItemDragOverlay workoutItem={draggingItem} />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </>
  );
}
