import "./ExerciseSelector.scss";
import { useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import AsyncDropdown from "../DropdownMenu/AsyncDropdown/AsyncDropdown";
import ExerciseSelectorSegment from "./ExerciseSelectorSegment";
import sendAPIRequest from "../../Data/SendAPIRequest";

export type ChooseExerciseData = {
  id: string;
  exercise: ExerciseSchema;
};

export type ChooseExerciseFilters = {
  muscleGroupId: number | null;
  equipmentId: number | null;
  name: string | null;
};

type ExerciseSchema = Schema<"SimpleExerciseResponseDTO">;

type ChooseExerciseWindowProps = {
  onClose: () => void;
  onConfirmSelection: (exercise: ExerciseSchema | ExerciseSchema[]) => void;
  singleMode?: boolean;
};

export default function ExerciseSelector({
  onClose,
  onConfirmSelection,
  singleMode: replaceMode,
}: ChooseExerciseWindowProps) {
  const [selected, setSelectedExercises] = useState<
    ExerciseSchema | ExerciseSchema[]
  >([]);

  const [exercisePromises, setExercisePromises] = useState<
    Promise<ExerciseSchema[]>[]
  >([]);

  const handleConfirm = () => {
    setSelectedExercises([]);
    onConfirmSelection(selected);
    onClose();
  };

  const handleSelectExercise = (exercise: ExerciseSchema) => {
    setSelectedExercises((prevSelectedExercises) => {
      if (replaceMode || !Array.isArray(prevSelectedExercises)) return exercise;

      if (prevSelectedExercises.includes(exercise))
        return prevSelectedExercises.filter((e) => e !== exercise);

      return [...prevSelectedExercises, exercise];
    });
  };

  const isWaitingForResponse = useRef(false);
  const reachedEnd = useRef(false);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isWaitingForResponse.current) return;

    isWaitingForResponse.current = true;
    setExercisePromises([
      sendAPIRequest("/api/exercise", {
        method: "get",
        parameters: {
          limit: 10,
          offset: 0,
        },
      }).then((x) => {
        isWaitingForResponse.current = false;
        if (x.code === "Too Many Requests") return [];

        if (x.code === "OK") {
          if (x.content.length !== 10) {
            reachedEnd.current = true;

            if (loadMoreButtonRef.current)
              loadMoreButtonRef.current.disabled = true;
          }
          return x.content;
        }

        reachedEnd.current = true;
        return [];
      }),
    ]);
  }, []);

  async function handleLazyLoad() {
    if (isWaitingForResponse.current || reachedEnd.current) return;

    isWaitingForResponse.current = true;
    setExercisePromises([
      ...exercisePromises,
      sendAPIRequest("/api/exercise", {
        method: "get",
        parameters: {
          limit: 10,
          offset: exercisePromises.length * 10,
        },
      }).then((x) => {
        isWaitingForResponse.current = false;
        if (x.code === "Too Many Requests") return [];

        if (x.code === "OK") {
          if (x.content.length !== 10) {
            reachedEnd.current = true;

            if (loadMoreButtonRef.current)
              loadMoreButtonRef.current.disabled = true;
          }
          return x.content;
        }

        reachedEnd.current = true;
        return [];
      }),
    ]);
  }

  const equipmentFilter = useRef<number>(-1);
  const muscleGroupFilter = useRef<number>(-1);
  const searchBarRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    // if (!onSearch) return;
    /*     setLazyLoaded([]);

    onSearch({
      equipmentId:
        equipmentFilter.current === -1 ? null : equipmentFilter.current,
      muscleGroupId:
        muscleGroupFilter.current === -1 ? null : muscleGroupFilter.current,
      name:
        !searchBarRef.current || searchBarRef.current?.value === ""
          ? null
          : searchBarRef.current?.value,
    }); */
  }

  function handleEquipmentFilterChange(newSelectionKey: string) {
    equipmentFilter.current = +newSelectionKey.replace(".$", "");
  }

  function handleMuscleGroupFilterChange(newSelectionKey: string) {
    muscleGroupFilter.current = +newSelectionKey.replace(".$", "");
  }

  return (
    <div className="exercise-selector">
      <div className="header">
        <h3 className="title">Choose Exercise</h3>

        <div className="search-bar-container">
          <Icon name="search" />

          <input
            type="text"
            className="search-bar"
            ref={searchBarRef}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button className="search-btn">
            <Icon onClick={handleSearch} name="arrow-right" />
          </button>
        </div>

        <div className="filters-container">
          <AsyncDropdown<"SimpleMuscleGroupResponseDTO">
            onRequest={() => {
              return Promise.resolve([]);
            }}
            placeholder="All muscles"
            className="muscles-dropdown"
            onSelectionChanged={handleMuscleGroupFilterChange}
          />

          <AsyncDropdown<"SimpleEquipmentResponseDTO">
            onRequest={() => {
              return Promise.resolve([]);
            }}
            placeholder="All equipment"
            className="equipment-dropdown"
            onSelectionChanged={handleEquipmentFilterChange}
          />
        </div>
      </div>

      <div className="body">
        {exercisePromises.map((exercisesPromise, i) => (
          <ExerciseSelectorSegment
            key={i}
            exercises={exercisesPromise}
            onSelectExercise={handleSelectExercise}
            selectedExercises={selected}
          />
        ))}
      </div>

      <div className="footer">
        <button className="choose-exercise-button" onClick={handleConfirm}>
          {replaceMode ? "Replace" : "Add"}
        </button>

        <button
          className="choose-exercise-button"
          onClick={handleLazyLoad}
          ref={loadMoreButtonRef}
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
