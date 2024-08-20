import "./WorkoutItem.scss";
import React from "react";
import Icon from "../../Icon/Icon.tsx";
import { Set } from "./WorkoutItem.tsx";

type StaticWorkoutSetDisplayProps = {
  set: Set;
  index: number;
};

export default function SetDragOverlay({
  set,
  index,
}: StaticWorkoutSetDisplayProps): React.JSX.Element {
  return (
    <div className="set" id={`set-${set.id}`} aria-hidden tabIndex={-1}>
      <div className="options">
        <button className="drag-handle">
          <Icon name="grip-vertical" />
        </button>

        <button className="duplicate">
          <Icon name="copy" />
        </button>
      </div>

      <div className="information-container">
        <div className="set-type-dropdown-container">
          <button>
            {set.type && set.type !== "1" ? (
              <Icon className="set-icon" name={set.type} />
            ) : (
              index + 1
            )}
          </button>
        </div>

        <div>
          {!set.type || set.type === "1" ? (
            <input
              type="text"
              value={set.rir <= 0 ? "" : set.rir}
              placeholder={set.rir <= 0 ? "0" : set.rir.toString()}
              maxLength={4}
              disabled
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
            disabled
          />
        </div>
      </div>
    </div>
  );
}
