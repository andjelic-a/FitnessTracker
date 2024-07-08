import { useState } from "react";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";

interface ChooseExerciseProps {
  onClose: () => void;
  onAddExercise: (exercises: string[]) => void;
}

export default function ChooseExercise({
  onClose,
  onAddExercise,
}: ChooseExerciseProps) {
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);

  const handleConfirm = () => {
    if (selectedExercises.length > 0) {
      onAddExercise(selectedExercises);
      onClose();
    }
  };

  const handleSelectExercise = (exercise: string) => {
    setSelectedExercises((prevSelectedExercises) => {
      if (prevSelectedExercises.includes(exercise)) {
        return prevSelectedExercises.filter((e) => e !== exercise);
      } else {
        return [...prevSelectedExercises, exercise];
      }
    });
  };

  return (
    <div className="choose-exercise">
      <div className="choose-exercise-header">
        <h3>Choose Exercise</h3>
      </div>
      <div className="choose-exercise-body">
        <ExerciseOption
          exercise="Exercise 1"
          onSelectExercise={handleSelectExercise}
          isSelected={selectedExercises.includes("Exercise 1")}
        />
        <ExerciseOption
          exercise="Exercise 2"
          onSelectExercise={handleSelectExercise}
          isSelected={selectedExercises.includes("Exercise 2")}
        />
        <ExerciseOption
          exercise="Exercise 3"
          onSelectExercise={handleSelectExercise}
          isSelected={selectedExercises.includes("Exercise 3")}
        />
      </div>
      <div className="choose-exercise-footer">
        <button className="choose-exercise-button" onClick={handleConfirm}>Add</button>
        <button className="choose-exercise-button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

interface ExerciseOptionProps {
  exercise: string;
  onSelectExercise: (exercise: string) => void;
  isSelected: boolean;
}

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
      <img src="../../../public/DefaultProfilePicture.png" alt="Exercise" />
      <h3>{exercise}</h3>
    </div>
  );
}