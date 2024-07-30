import "./ChooseExercise.scss";
import { useRef, useState } from "react";
import { Schema } from "../../../../Types/Endpoints/SchemaParser";
import { ExerciseOption } from "./ExerciseOption";
import Icon from "../../../Icon/Icon";
import AsyncDropdown from "../../../DropdownMenu/AsyncDropdown/AsyncDropdown";
import Exercise from "../../../Exercise/Exercise";

export type ChooseExerciseData = {
  id: string;
  exercise: Schema<"SimpleExerciseResponseDTO">;
};

export type ChooseExerciseFilters = {
  muscleGroupId: number | null;
  equipmentId: number | null;
  name: string | null;
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
  onRequestMuscleGroups: () => Promise<
    Schema<"SimpleMuscleGroupResponseDTO">[]
  >;
  onRequestEquipment: () => Promise<Schema<"SimpleEquipmentResponseDTO">[]>;
  onSearch: (filters: ChooseExerciseFilters) => void;
};

export default function ChooseExerciseWindow({
  onClose,
  onConfirmSelection,
  singleMode: replaceMode,
  exercises: preLoadedExercises,
  onRequestLazyLoad,
  onRequestEquipment,
  onRequestMuscleGroups,
  onSearch,
}: ChooseExerciseWindowProps) {
  const [selected, setSelectedExercises] = useState<
    Schema<"SimpleExerciseResponseDTO"> | Schema<"SimpleExerciseResponseDTO">[]
  >([]);

  const [isLinkClicked, setIsLinkClicked] = useState<boolean>(false);

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

  async function requireLazyLoad() {
    if (!onRequestLazyLoad) return;

    const newExercises = await onRequestLazyLoad();
    setLazyLoaded([...lazyLoaded, ...(newExercises ?? [])]);
  }

  const requireLazyLoadBtnRef = useRef<HTMLButtonElement>(null);

  const equipmentFilter = useRef<number>(-1);
  const muscleGroupFilter = useRef<number>(-1);
  const searchBarRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    if (!onSearch) return;
    setLazyLoaded([]);

    onSearch({
      equipmentId:
        equipmentFilter.current === -1 ? null : equipmentFilter.current,
      muscleGroupId:
        muscleGroupFilter.current === -1 ? null : muscleGroupFilter.current,
      name:
        !searchBarRef.current || searchBarRef.current?.value === ""
          ? null
          : searchBarRef.current?.value,
    });
  }

  function handleEquipmentFilterChange(newSelectionKey: string) {
    equipmentFilter.current = +newSelectionKey.replace(".$", "");
  }

  function handleMuscleGroupFilterChange(newSelectionKey: string) {
    muscleGroupFilter.current = +newSelectionKey.replace(".$", "");
  }

  function handleLinkClick(isLinkClicked: boolean) {
    setIsLinkClicked(isLinkClicked);
  }

  return (
    <>
      <Exercise setIsOpen={setIsLinkClicked} isOpen={isLinkClicked} />
      <div className="choose-exercise" id="choose-exercise">
        <div className="choose-exercise-header">
          <h3>Choose Exercise</h3>
        </div>
        <div className="choose-exercise-body">
          <div className="choose-exercise-search-container">
            <div className="choose-exercise-search-bar-container">
              <Icon className="choose-exercise-search-bar-icon" name="search" />
              <input
                type="text"
                className="choose-exercise-search-bar"
                ref={searchBarRef}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Icon
                onClick={handleSearch}
                className="choose-exercise-search-bar-icon arrow-right-icon"
                name="arrow-right"
              />
            </div>
            <div className="choose-exercise-filter">
              <AsyncDropdown<"SimpleMuscleGroupResponseDTO">
                onRequest={onRequestMuscleGroups}
                placeholder="All muscles"
                className="choose-exercise-filter-muscles-dropdown"
                onSelectionChanged={handleMuscleGroupFilterChange}
              />

              <AsyncDropdown<"SimpleEquipmentResponseDTO">
                onRequest={onRequestEquipment}
                placeholder="All equipment"
                className="choose-exercise-filter-equipment-dropdown"
                onSelectionChanged={handleEquipmentFilterChange}
              />
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
              handleLinkClick={handleLinkClick}
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
    </>
  );
}
