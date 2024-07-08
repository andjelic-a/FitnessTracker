import { useState } from "react";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";

type ChooseExerciseProps = {
  onClose: () => void;
  onAddExercise: (exercises: Schema<"SimpleExerciseResponseDTO">[]) => void;
  isReplaceMode: boolean;
  preLoadedExercises: Schema<"SimpleExerciseResponseDTO">[];
};

export default function ChooseExercise({
  onClose,
  onAddExercise,
  isReplaceMode,
  preLoadedExercises,
}: ChooseExerciseProps) {
  const [selectedExercises, setSelectedExercises] = useState<
    Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  const handleConfirm = () => {
    if (selectedExercises.length > 0) {
      onAddExercise(selectedExercises);
      onClose();
    }
  };

  const handleSelectExercise = (
    exercise: Schema<"SimpleExerciseResponseDTO">
  ) => {
    setSelectedExercises((prevSelectedExercises) => {
      if (isReplaceMode) {
        return [exercise];
      } else {
        if (prevSelectedExercises.includes(exercise)) {
          return prevSelectedExercises.filter((e) => e !== exercise);
        } else {
          return [...prevSelectedExercises, exercise];
        }
      }
    });
  };

  return (
    <div className="choose-exercise">
      <div className="choose-exercise-header">
        <h3>Choose Exercise</h3>
      </div>
      <div className="choose-exercise-body">
        {preLoadedExercises.map((exercise) => (
          <ExerciseOption
            key={exercise.id}
            exercise={exercise}
            onSelectExercise={handleSelectExercise}
            isSelected={selectedExercises.includes(exercise)}
          />
        ))}
      </div>
      <div className="choose-exercise-footer">
        <button className="choose-exercise-button" onClick={handleConfirm}>
          {isReplaceMode ? "Replace" : "Add"}
        </button>
        <button className="choose-exercise-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

interface ExerciseOptionProps {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  onSelectExercise: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
  isSelected: boolean;
}

//TODO: On hover over image (hold click on mobile) enlarge it for better UX
function ExerciseOption({
  exercise,
  onSelectExercise,
  isSelected,
}: ExerciseOptionProps) {
  const handleClick = () => {
    onSelectExercise(exercise);
  };

  return (
    <div
      className={"exercise-option " + (isSelected ? "selected" : "")}
      onClick={handleClick}
    >
      <div className="select-circle-container">
        <div>
          {isSelected && <Icon className="select-circle-check" name="check" />}
        </div>
      </div>
      <img
        src={exercise.image ?? "/DefaultProfilePicture.png"}
        alt="Exercise"
      />
      <h3>{exercise.name}</h3>
    </div>
  );
}
