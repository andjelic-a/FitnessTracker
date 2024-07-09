import { useState } from "react";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import useLazyLoading from "../../../../Hooks/UseLazyLoading";

type ChooseExerciseProps = {
  onClose: () => void;
  onAddExercise: (exercises: Schema<"SimpleExerciseResponseDTO">[]) => void;
  isReplaceMode: boolean;
  exercises: Schema<"SimpleExerciseResponseDTO">[];
  onRequireLazyLoad?: () => Promise<
    Schema<"SimpleExerciseResponseDTO">[] | null
  >;
};

export default function ChooseExercise({
  onClose,
  onAddExercise,
  isReplaceMode,
  exercises: preLoadedExercises,
  onRequireLazyLoad,
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

  const [lazyLoaded, setLazyLoaded] = useState<
    Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  useLazyLoading("#choose-exercise", 0.7, async () => {
    if (!onRequireLazyLoad) return;

    const newExercises = await onRequireLazyLoad();
    setLazyLoaded([...lazyLoaded, ...(newExercises ?? [])]);
  });

  return (
    <div className="choose-exercise" id="choose-exercise">
      <div className="choose-exercise-header">
        <h3>Choose Exercise</h3>
      </div>
      <div className="choose-exercise-body">
        {[...preLoadedExercises, ...lazyLoaded].map((exercise) => (
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
