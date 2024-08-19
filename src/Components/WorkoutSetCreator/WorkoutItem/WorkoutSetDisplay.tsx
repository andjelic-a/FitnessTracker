import "./WorkoutItem.scss";
import React, { useContext, useMemo, useRef, useState } from "react";
import Icon from "../../Icon/Icon.tsx";
import { SetType, Set } from "./WorkoutItem.tsx";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";
import useOutsideClick from "../../../Hooks/UseOutsideClick.ts";

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
  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  const iconDropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sets = useMemo(
    () =>
      currentSetsContext.currentSets
        .filter((x) => x.id === itemId)
        .flatMap((x) => x.sets),
    [currentSetsContext.currentSets]
  );

  useOutsideClick(iconDropdownRef, () => void setIsDropdownOpen(false));

  const handleSetsChanged = (newSets: Set[]) => {
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === itemId);
      if (index >= 0) prev[index].sets = newSets;

      return prev.slice();
    });
  };

  function handleSetChanged(set: Set) {
    handleSetsChanged(
      sets.map((prevSet) => (prevSet.id === set.id ? set : prevSet))
    );
  }

  function handleChangeSetIcon(newIcon: SetType) {
    handleSetChanged({
      ...set,
      type: newIcon,
    });
    setIsDropdownOpen(false);
  }

  const handleDeleteSet = () => {
    const prevSets = sets.slice();
    handleSetsChanged(prevSets.filter((prevSet) => prevSet.id !== set.id));
  };

  return (
    <div className="set" id={`set-${set.id}`}>
      <div className="options">
        <button className="drag-handle">
          <Icon name="grip-vertical" />
        </button>

        <button className="duplicate" aria-describedby="duplicate-set-desc">
          <Icon name="copy" />

          <p
            id="duplicate-set-desc"
            className="accessibility-only"
            aria-hidden={false}
          >
            Duplicate set
          </p>
        </button>
      </div>

      <div className="information-container">
        <div className="set-type-dropdown-container">
          <button onClick={() => void setIsDropdownOpen(true)}>
            {set.type && set.type !== "1" ? (
              <Icon className="set-icon" name={set.type} />
            ) : (
              index + 1
            )}
          </button>

          {/* TODO: make the dropdown menu's items (?non focusable by tabbing and instead only?) reachable with arrows */}
          {/* TODO?: make the dropdown open on focus, close on escape or blur (un-focus) */}
          {isDropdownOpen && (
            <div ref={iconDropdownRef} className="set-dropdown-menu">
              <button onClick={() => handleChangeSetIcon("1")}>
                {index + 1}
              </button>

              <button onClick={() => handleChangeSetIcon("w")}>Warmup</button>

              <button onClick={() => handleChangeSetIcon("d")}>Drop set</button>

              <button onClick={() => handleChangeSetIcon("f")}>Failure</button>

              <button onClick={handleDeleteSet}>
                <Icon className="set-icon x" name="xmark" />
              </button>
            </div>
          )}
        </div>

        <div>
          {!set.type || set.type === "1" ? (
            <input
              type="text"
              value={set.rir <= 0 ? "" : set.rir}
              placeholder={set.rir <= 0 ? "0" : set.rir.toString()}
              maxLength={4}
              onChange={(e) =>
                handleSetChanged({ ...set, rir: +e.target.value })
              }
            />
          ) : (
            <input type="text" disabled value={set.type === "w" ? "-" : "0"} />
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
    </div>
  );
}
