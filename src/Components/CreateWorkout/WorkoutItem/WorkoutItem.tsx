import "./WorkoutItem.scss";
import { useState, useRef, useContext } from "react";
import Icon from "../../Icon/Icon.tsx";
import useOutsideClick from "../../../Hooks/UseOutsideClick.ts";
import { Schema } from "../../../Types/Endpoints/SchemaParser.ts";
import WorkoutExerciseDisplay from "./WorkoutExerciseDisplay.tsx";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";

//TODO:? Make rir field or the entire workout item change color or tint based on type of set
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
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const workoutSettingsPopup = useRef<HTMLDivElement | null>(null);

  const handleReplaceExerciseClick = () => {
    setIsSettingsOpen(false);
    onRequestExerciseReplace(workoutItem.id);
  };

  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  //TODO: Fix this
  useOutsideClick(workoutSettingsPopup, () => {
    console.log("a");

    if (isSettingsOpen) setIsSettingsOpen(false);
  });

  const handleSettingsClick = () => void setIsSettingsOpen(!isSettingsOpen);

  const handleSetsChanged = (newSets: Set[]) => {
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === workoutItem.id);

      if (index < 0) prev.push(workoutItem);
      else prev[index].sets = newSets;

      return prev.slice();
    });
  };

  const handleDelete = () => {
    currentSetsContext.setCurrentSets((prev) =>
      prev.filter((item) => item.id !== workoutItem.id).slice()
    );
  };

  return (
    <div className="workout-item" id={`workout-item-${workoutItem.id}`}>
      <div className="workout-item-header">
        <img src={workoutItem.exercise.image} />

        <p>{workoutItem.exercise.name}</p>

        <Icon
          onClick={handleSettingsClick}
          className="workout-settings-icon"
          name="ellipsis-vertical"
        />

        <div
          ref={workoutSettingsPopup}
          className={`workout-settings-popup ${
            !isSettingsOpen ? "hidden" : ""
          }`}
        >
          <p onClick={handleReplaceExerciseClick}>Replace exercise</p>

          <p onClick={handleDelete}>Delete exercise</p>
        </div>
      </div>

      <div className="workout-item-body">
        <WorkoutExerciseDisplay
          sets={
            currentSetsContext.currentSets.find((x) => x.id === workoutItem.id)
              ?.sets ?? []
          }
          setSets={handleSetsChanged}
          itemId={workoutItem.id}
        />
      </div>
    </div>
  );
}
