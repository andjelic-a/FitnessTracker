import "./WorkoutItem.scss";
import React, { useRef, MutableRefObject } from "react";
import Icon from "../../../Icon/Icon.tsx";
import { PossibleSetIcon, Set } from "./WorkoutItem.tsx";

type SingleExerciseSetProps = {
  set: Set;
  onSetChanged: (newSet: Set) => void;
  index: number;
  dropDownMenuWrapper?: MutableRefObject<(HTMLDivElement | null)[]>;
  onSetClick?: (id: string) => void;
  onDeleteSet?: (id: string) => void;
  onChangeSetIcon?: (id: string, icon: PossibleSetIcon) => void;
};

export default function WorkoutSetDisplay({
  set,
  index,
  dropDownMenuWrapper,
  onSetClick,
  onDeleteSet,
  onChangeSetIcon,
  onSetChanged,
}: SingleExerciseSetProps): React.JSX.Element {
  const setWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="exercise-set-item"
      ref={setWrapperRef}
      id={`exercise-set-item-${set.id}`}
    >
      <div className="set-button">
        <p onClick={() => onSetClick?.(set.id)}>
          {set.selectedIcon ? (
            <Icon className="set-icon" name={set.selectedIcon} />
          ) : (
            set.idx
          )}
        </p>
        <div
          ref={(element) =>
            dropDownMenuWrapper
              ? (dropDownMenuWrapper.current[index] = element)
              : void element
          }
          className={`set-dropdown-menu ${!set.isDropdownOpen ? "hidden" : ""}`}
        >
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "1")}>
              {index + 1}
            </div>
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "w")}>Warmup</div>
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "d")}>Drop set</div>
          </span>
          <span>
            <div onClick={() => onChangeSetIcon?.(set.id, "f")}>Failure</div>
          </span>
          <span>
            <Icon
              onClick={() => onDeleteSet?.(set.id)}
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
            onChange={(e) => onSetChanged?.({ ...set, rir: +e.target.value })}
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
          onChange={(e) => onSetChanged?.({ ...set, repRange: e.target.value })}
        />
      </div>
    </div>
  );
}
