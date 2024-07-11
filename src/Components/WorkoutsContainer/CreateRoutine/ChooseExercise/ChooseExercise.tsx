import "./ChooseExercise.scss";
import { useRef, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import { ExerciseOption } from "./ExerciseOption";
import { v4 as uuidv4 } from "uuid";
import Dropdown from "../../../DropdownMenu/Dropdown";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import DropdownItem from "../../../DropdownMenu/DropdownItem";

export type ChooseExerciseType = {
  id: string;
  exercise: Schema<"SimpleExerciseResponseDTO">;
};

type ChooseExerciseProps = {
  onClose: () => void;
  onAddExercise: (exercise: ChooseExerciseType[]) => void;
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
      onAddExercise(
        selectedExercises.map((x) => ({
          exercise: x,
          id: uuidv4(),
        }))
      );
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
        <div className="choose-exercise-search-container">
          <div className="choose-exercise-search-bar-container">
            <Icon className="choose-exercise-search-bar-icon" name="search" />
            <input type="text" className="choose-exercise-search-bar" />
          </div>
          <Dropdown
            className="choose-exercise-filter-dropdown"
            placeholder="All muscles"
          >
            <DropdownItem>Option 1</DropdownItem>
            <DropdownItem>Option 2</DropdownItem>
            <DropdownItem>Option 3</DropdownItem>
          </Dropdown>
        </div>
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
