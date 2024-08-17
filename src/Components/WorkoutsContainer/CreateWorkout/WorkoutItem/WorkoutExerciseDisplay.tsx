import "./WorkoutItem.scss";
import React, { useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { v4 as uuidv4 } from "uuid";
import useOutsideClick from "../../../../Hooks/UseOutsideClick.ts";
import { PossibleSetIcon, Set } from "./WorkoutItem.tsx";
import WorkoutSetDisplay from "./WorkoutSetDisplay.tsx";

type ExerciseSetProps = {
  sets: Set[];
  setSets: React.Dispatch<React.SetStateAction<Set[]>>;
};

export default function WorkoutExerciseDisplay({
  sets,
  setSets,
}: ExerciseSetProps): React.JSX.Element {
  const excludedDivRef = useRef<(HTMLDivElement | null)[]>([]);

  useOutsideClick(excludedDivRef, () => {
    setSets((prevSets) =>
      prevSets.map((set) => ({ ...set, isDropdownOpen: false }))
    );
  });

  const addSet = () => {
    const newSet: Set = {
      id: uuidv4(),
      idx: sets.length + 1,
      rir: 0,
      repRange: "0",
      isDropdownOpen: false,
      selectedIcon: null,
    };

    setSets([...sets, newSet]);
  };

  const handleSetClick = (id: string) => {
    setSets((prevSets) =>
      prevSets.map((set) =>
        set.id === id
          ? { ...set, isDropdownOpen: !set.isDropdownOpen }
          : { ...set, isDropdownOpen: false }
      )
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      excludedDivRef.current.forEach((ref, index) => {
        if (ref && !ref.contains(event.target as Node)) {
          setSets((prevSets) =>
            prevSets.map((set, i) =>
              i === index ? { ...set, isDropdownOpen: false } : set
            )
          );
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const findPositionOfElement = (id: string) => {
    return sets.findIndex((set) => set.id === id);
  };

  const changeSetIcon = (id: string, icon: PossibleSetIcon) => {
    setSets((prevSets) => {
      return prevSets.map((set) => {
        if (set.id === id) {
          if (icon === "1") {
            return {
              ...set,
              selectedIcon: null,
              idx: findPositionOfElement(id) + 1,
              isDropdownOpen: false,
            };
          } else {
            return {
              ...set,
              selectedIcon: icon,
              isDropdownOpen: false,
            };
          }
        } else {
          return set;
        }
      });
    });
  };

  const deleteSet = (id: string) => {
    setSets((prevSets) => {
      const updatedSets = prevSets.filter((set) => set.id !== id);

      return updatedSets.map((set, index) => ({
        ...set,
        set: index + 1,
      }));
    });
  };

  const setContainerRef = useRef<HTMLDivElement>(null);

  function handleSetChanged(set: Set) {
    setSets((prevSets) =>
      prevSets.map((prevSet) => (prevSet.id === set.id ? set : prevSet))
    );
  }

  return (
    <div className="exercise-set" ref={setContainerRef}>
      <div className="exercise-set-placeholder">
        <p>SET</p>
        <p>RiR</p>
        <p>VOLUME</p>
      </div>
      {sets.map((set, index) => (
        <WorkoutSetDisplay
          key={set.id}
          set={set}
          onSetChanged={handleSetChanged}
          index={index}
          onSetClick={handleSetClick}
          onDeleteSet={deleteSet}
          onChangeSetIcon={changeSetIcon}
          dropDownMenuWrapper={excludedDivRef}
        />
      ))}
      <div className="icon-wrapper">
        <Icon onClick={addSet} className="add-set-icon" name="plus" />
      </div>
    </div>
  );
}
