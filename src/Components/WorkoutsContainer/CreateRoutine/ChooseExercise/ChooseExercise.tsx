import "./ChooseExercise.scss";
import { useRef, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import { ExerciseOption } from "./ExerciseOption";
import Dropdown from "../../../DropdownMenu/Dropdown";
import Icon from "../../../Icon/Icon";
import "./ChooseExercise.scss";
import DropdownItem from "../../../DropdownMenu/DropdownItem";

export type ChooseExerciseData = {
  id: string;
  exercise: Schema<"SimpleExerciseResponseDTO">;
};

type ChooseExerciseWindowProps = {
  onClose: () => void;
  onConfirmSelection: (
    exercise:
      | Schema<"SimpleExerciseResponseDTO">
      | Schema<"SimpleExerciseResponseDTO">[]
  ) => void;
  singleMode?: boolean;
  exercises: Schema<"SimpleExerciseResponseDTO">[];
  onRequestLazyLoad: () => Promise<
    Schema<"SimpleExerciseResponseDTO">[] | null
  >;
};

export default function ChooseExerciseWindow({
  onClose,
  onConfirmSelection,
  singleMode: replaceMode,
  exercises: preLoadedExercises,
  onRequestLazyLoad,
}: ChooseExerciseWindowProps) {
  const [selected, setSelectedExercises] = useState<
    Schema<"SimpleExerciseResponseDTO"> | Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  const handleConfirm = () => {
    onConfirmSelection(selected);
    onClose();
  };

  const handleSelectExercise = (
    exercise: Schema<"SimpleExerciseResponseDTO">
  ) => {
    setSelectedExercises((prevSelectedExercises) => {
      if (replaceMode || !Array.isArray(prevSelectedExercises)) return exercise;

      if (prevSelectedExercises.includes(exercise))
        return prevSelectedExercises.filter((e) => e !== exercise);

      return [...prevSelectedExercises, exercise];
    });
  };

  const [lazyLoaded, setLazyLoaded] = useState<
    Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  // useLazyLoading("#choose-exercise", 0.7, requireLazyLoad);

  async function requireLazyLoad() {
    if (!onRequestLazyLoad) return;

    const newExercises = await onRequestLazyLoad();
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
          <div className="choose-exercise-filter">
            <Dropdown
              className="choose-exercise-filter-muscles-dropdown"
              placeholder="All muscles"
            >
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
            </Dropdown>
            <Dropdown
              className="choose-exercise-filter-equipment-dropdown"
              placeholder="All equipment"
            >
              <DropdownItem>Option 1</DropdownItem>
              <DropdownItem>Option 2</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
              <DropdownItem>Option 3</DropdownItem>
            </Dropdown>
          </div>
        </div>
        {[...preLoadedExercises, ...lazyLoaded].map((exercise) => (
          <ExerciseOption
            key={exercise.id}
            exercise={exercise}
            onSelectExercise={handleSelectExercise}
            isSelected={
              Array.isArray(selected)
                ? selected.includes(exercise)
                : selected === exercise
            }
          />
        ))}
      </div>
      <div className="choose-exercise-footer">
        <button className="choose-exercise-button" onClick={handleConfirm}>
          {replaceMode ? "Replace" : "Add"}
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
