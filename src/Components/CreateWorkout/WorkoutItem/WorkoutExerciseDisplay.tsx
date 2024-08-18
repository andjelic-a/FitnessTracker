import "./WorkoutItem.scss";
import React, { useContext, useMemo } from "react";
import Icon from "../../Icon/Icon.tsx";
import { v4 as uuidv4 } from "uuid";
import { Set } from "./WorkoutItem.tsx";
import WorkoutSetDisplay from "./WorkoutSetDisplay.tsx";
import CurrentEditingWorkoutSetsContext from "../../../Contexts/CurrentEditingWorkoutSetsContext.ts";

type ExerciseSetProps = {
  sets: Set[];
  setSets: (newSets: Set[]) => void;
  itemId: string;
};

export default function WorkoutExerciseDisplay({
  // sets,
  // setSets,
  itemId,
}: ExerciseSetProps): React.JSX.Element {
  const currentSetsContext = useContext(CurrentEditingWorkoutSetsContext);

  // useOutsideClick(excludedDivRef, () => {
  //   const oldSets = currentSetsContext.currentSets.slice();
  //   handleSetChanged(oldSets.map((set) => ({ ...set, isDropdownOpen: false })));
  // });

  const sets = useMemo(
    () =>
      currentSetsContext.currentSets
        .filter((x) => x.id === itemId)
        .flatMap((x) => x.sets),
    [currentSetsContext.currentSets]
  );

  const addSet = () => {
    const newSet: Set = {
      id: uuidv4(),
      idx: sets.length + 1,
      rir: 0,
      repRange: "0",
      isDropdownOpen: false,
      selectedIcon: null,
    };

    handleSetsChanged([...sets, newSet]);
  };

  const handleSetsChanged = (newSets: Set[]) => {
    currentSetsContext.setCurrentSets((prev) => {
      const index = prev.findIndex((x) => x.id === itemId);
      if (index >= 0) prev[index].sets = newSets;

      return prev.slice();
    });
  };

  return (
    <div className="exercise-set">
      <div className="exercise-set-placeholder">
        <p>SET</p>
        <p>RiR</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set, index) => (
        <WorkoutSetDisplay
          key={set.id}
          set={set}
          index={index}
          itemId={itemId}
        />
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}
