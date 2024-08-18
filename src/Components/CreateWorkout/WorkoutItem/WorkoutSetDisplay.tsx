import "./WorkoutItem.scss";
import React, { useContext, useMemo, useRef } from "react";
import Icon from "../../Icon/Icon.tsx";
import { PossibleSetIcon, Set } from "./WorkoutItem.tsx";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";

type SingleExerciseSetProps = {
  set: Set;
  index: number;
  itemId: string;
};

export default function WorkoutSetDisplay({
  set,
  index,
  itemId,
}: SingleExerciseSetProps): React.JSX.Element {
  const setWrapperRef = useRef<HTMLDivElement>(null);
  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  const sets = useMemo(
    () =>
      currentSetsContext.currentSets
        .filter((x) => x.id === itemId)
        .flatMap((x) => x.sets),
    [currentSetsContext.currentSets]
  );

  const handleSetsChanged = (newSets: Set[]) => {
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === itemId);
      if (index >= 0) prev[index].sets = newSets;

      return prev.slice();
    });
  };

  function handleSetChanged(set: Set) {
    const prevSets = sets.slice();
    handleSetsChanged(
      prevSets.map((prevSet) => (prevSet.id === set.id ? set : prevSet))
    );
  }

  function handleChangeSetIcon(newIcon: PossibleSetIcon) {
    handleSetChanged({
      ...set,
      isDropdownOpen: false,
      selectedIcon: newIcon,
    });
  }

  function handleSetIconClick() {
    handleSetChanged({
      ...set,
      isDropdownOpen: true,
    });
  }

  const handleDeleteSet = () => {
    const prevSets = sets.slice();
    handleSetsChanged(prevSets.filter((prevSet) => prevSet.id !== set.id));
  };

  return (
    <div
      className="exercise-set-item"
      ref={setWrapperRef}
      id={`exercise-set-item-${set.id}`}
    >
      <div className="set-button">
        <p onClick={handleSetIconClick}>
          {set.selectedIcon ? (
            <Icon className="set-icon" name={set.selectedIcon} />
          ) : (
            set.idx
          )}
        </p>
        <div
          className={`set-dropdown-menu ${!set.isDropdownOpen ? "hidden" : ""}`}
        >
          <span>
            <div onClick={() => handleChangeSetIcon("1")}>{index + 1}</div>
          </span>
          <span>
            <div onClick={() => handleChangeSetIcon("w")}>Warmup</div>
          </span>
          <span>
            <div onClick={() => handleChangeSetIcon("d")}>Drop set</div>
          </span>
          <span>
            <div onClick={() => handleChangeSetIcon("f")}>Failure</div>
          </span>
          <span>
            <Icon
              onClick={handleDeleteSet}
              className="set-icon x"
              name="xmark"
            />
          </span>
        </div>
      </div>
      <div>
        {!set.selectedIcon || set.selectedIcon === "1" ? (
          <input
            type="text"
            value={set.rir <= 0 ? "" : set.rir}
            placeholder={set.rir <= 0 ? "0" : set.rir.toString()}
            maxLength={4}
            onChange={(e) => handleSetChanged({ ...set, rir: +e.target.value })}
          />
        ) : (
          <input
            type="text"
            disabled
            value={set.selectedIcon === "w" ? "-" : "0"}
          />
        )}
      </div>
      <div>
        <input
          type="text"
          defaultValue={set.repRange === "0" ? "" : set.repRange}
          placeholder={set.repRange}
          maxLength={5}
          onChange={(e) =>
            handleSetChanged({ ...set, repRange: e.target.value })
          }
        />
      </div>
    </div>
  );
}
