import { useRef, useState } from "react";
import "./ChooseExercise.scss";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import { ExerciseOption } from "./ExerciseOption";

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

  // useLazyLoading("#choose-exercise", 0.7, requireLazyLoad);

  async function requireLazyLoad() {
    if (!onRequireLazyLoad) return;

    const newExercises = await onRequireLazyLoad();
    setLazyLoaded([...lazyLoaded, ...(newExercises ?? [])]);
  }

  const requireLazyLoadBtnRef = useRef<HTMLButtonElement>(null);

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
        <button
          className={"choose-exercise-button"}
          ref={requireLazyLoadBtnRef}
          onClick={requireLazyLoad}
          disabled={
            lazyLoaded.length + preLoadedExercises.length > 0 &&
            (lazyLoaded.length + preLoadedExercises.length) % 10 !== 0
          }
        >
          More
        </button>
        <button className="choose-exercise-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
