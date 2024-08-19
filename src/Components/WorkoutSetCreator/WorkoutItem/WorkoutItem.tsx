import "./WorkoutItem.scss";
import { useContext, useMemo } from "react";
import Icon from "../../Icon/Icon.tsx";
import { Schema } from "../../../Types/Endpoints/SchemaParser.ts";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";
import { useSortable } from "@dnd-kit/sortable";
import { v4 } from "uuid";
import WorkoutSetDisplay from "./WorkoutSetDisplay.tsx";
import { CSS } from "@dnd-kit/utilities";

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

  //TODO: Add drag and drop to reorder sets
  //TODO: Add a copy / duplicate button to sets
  return (
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

          {sets.map((set, index) => (
            <WorkoutSetDisplay
              key={set.id}
              set={set}
              index={index}
              itemId={workoutItem.id}
            />
          ))}

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
  );
}
