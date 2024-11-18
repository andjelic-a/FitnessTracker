import { useEffect, useRef, useState } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import sendAPIRequest from "../../Data/SendAPIRequest";
import Icon from "../Icon/Icon";
import WorkoutSelectorSegment from "./WorkoutSelectorSegment";
import "./SplitWorkoutSelector.scss";
import Toggle from "../Toggle/Toggle";
import WorkoutSelectorOption from "./WorkoutSelectorOption";

type WorkoutSchema = Schema<"SimpleWorkoutOptionResponseDTO">;

type ChooseWorkoutWindowProps = {
  defaultWorkout: WorkoutSchema | null;
  onClose: () => void;
  onConfirmSelection: (workout: WorkoutSchema | null) => void;
};

type Filters = {
  favoriteOnly: boolean;
  personalOnly: boolean;
};

export default function SplitWorkoutSelector({
  onClose,
  onConfirmSelection,
  defaultWorkout,
}: ChooseWorkoutWindowProps) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutSchema | null>(
    null
  );

  useEffect(() => void setSelectedWorkout(defaultWorkout), [defaultWorkout]);

  const [workoutPromises, setWorkoutPromises] = useState<
    Promise<WorkoutSchema[]>[]
  >([]);

  const isWaitingForResponse = useRef(false);
  const reachedEnd = useRef(false);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const searchBarRef = useRef<HTMLInputElement>(null);

  useEffect(handleInitialRequest, []);

  function getFilters(): {
    favoriteOnly?: boolean;
    personalOnly?: boolean;
    searchTerm?: string;
  } {
    let name: string | undefined = searchBarRef.current?.value?.trim() ?? "";
    if (name.length === 0) name = undefined;

    return {
      searchTerm: name,
      ...filters.current,
    };
  }

  function handleInitialRequest() {
    if (isWaitingForResponse.current) return;

    isWaitingForResponse.current = true;
    setWorkoutPromises([
      sendAPIRequest("/api/split/workout-options", {
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
      sendAPIRequest("/api/split/workout-options", {
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
    onConfirmSelection(selectedWorkout);
    setSelectedWorkout(null);
    onClose();
  }

  const filters = useRef<Filters>({
    favoriteOnly: false,
    personalOnly: false,
  });

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

        <div className="filters-container">
          <Toggle
            text="Favorites"
            onToggle={(x) => void (filters.current.favoriteOnly = x)}
          />

          <Toggle
            text="Created by me"
            onToggle={(x) => void (filters.current.personalOnly = x)}
          />
        </div>
      </div>

      <div
        className="body"
        role="listbox"
        aria-orientation="vertical"
        aria-label="Choose Workout"
      >
        <WorkoutSelectorOption
          key="rest-option"
          workout={null}
          isSelected={selectedWorkout === null}
          onSelectWorkout={setSelectedWorkout}
        />

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
          Replace
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
