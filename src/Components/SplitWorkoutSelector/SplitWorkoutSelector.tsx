import { useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import Icon from "../Icon/Icon";
import WorkoutSelectorSegment from "./WorkoutSelectorSegment";
import "./SplitWorkoutSelector.scss";

type WorkoutSchema = Schema<"SimpleWorkoutOptionResponseDTO">;

type ChooseWorkoutWindowProps = {
  onClose: () => void;
  onConfirmSelection: (workout: WorkoutSchema) => void;
  replaceMode?: boolean;
};

export default function SplitWorkoutSelector({
  onClose,
  onConfirmSelection,
  replaceMode,
}: ChooseWorkoutWindowProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSchema | null>(
    null
  );

  const [workoutPromises, setWorkoutPromises] = useState<
    Promise<WorkoutSchema[]>[]
  >([]);

  const isWaitingForResponse = useRef(false);
  const reachedEnd = useRef(false);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => handleInitialRequest, []);

  function getFilters(): {
    favoriteOnly?: boolean;
    publicOnly?: boolean;
    personalOnly?: boolean;
    searchTerm?: string;
  } {
    let name: string | undefined = searchBarRef.current?.value?.trim() ?? "";
    if (name.length === 0) name = undefined;

    return {
      searchTerm: name,
      favoriteOnly: false, //Todo: implement this
      publicOnly: false,
      personalOnly: false,
    };
  }

  function handleInitialRequest() {
    if (isWaitingForResponse.current) return;

    isWaitingForResponse.current = true;
    setWorkoutPromises([
      sendAPIRequest("/api/split/me/workoutoptions", {
        method: "get",
        parameters: {
          limit: 10,
          offset: 0,
          ...getFilters(),
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

  async function handleLazyLoad() {
    if (isWaitingForResponse.current || reachedEnd.current) return;

    isWaitingForResponse.current = true;
    setWorkoutPromises([
      ...workoutPromises,
      sendAPIRequest("/api/split/me/workoutoptions", {
        method: "get",
        parameters: {
          limit: 10,
          offset: workoutPromises.length * 10,
          ...getFilters(),
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

  function handleSearch() {
    if (isWaitingForResponse.current) return;

    reachedEnd.current = false;
    if (loadMoreButtonRef.current) loadMoreButtonRef.current.disabled = false;

    setWorkoutPromises([]);
    handleInitialRequest();
  }

  function handleConfirm() {
    if (!selectedWorkout) return;

    onConfirmSelection(selectedWorkout);
    setSelectedWorkout(null);
    onClose();
  }

  return (
    <div className="workout-selector">
      <div className="workout-selector-header">
        <h3 className="title">Choose Workout</h3>

        <div className="search-bar-container">
          <Icon name="search" />

          <input
            type="text"
            className="search-bar"
            ref={searchBarRef}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button className="search-btn">
            <Icon onClick={handleSearch} name="arrow-right" />
          </button>
        </div>

        <div className="filters-container">TODO: implement filters</div>
      </div>

      <div
        className="body"
        role="listbox"
        aria-orientation="vertical"
        aria-label="Choose Workout"
      >
        {workoutPromises.map((workoutsPromise, i) => (
          <WorkoutSelectorSegment
            key={i}
            workouts={workoutsPromise}
            onSelectWorkout={setSelectedWorkout}
            selectedWorkout={selectedWorkout}
          />
        ))}
      </div>

      <div className="footer">
        <button className="choose-workout-button" onClick={handleConfirm}>
          {replaceMode ? "Replace" : "Add"}
        </button>

        <button
          className="choose-workout-button"
          onClick={handleLazyLoad}
          ref={loadMoreButtonRef}
        >
          More
        </button>

        <button className="choose-workout-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
