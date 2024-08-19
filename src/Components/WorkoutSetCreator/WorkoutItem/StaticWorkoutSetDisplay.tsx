import "./WorkoutItem.scss";
import React from "react";
import Icon from "../../Icon/Icon.tsx";
import { Set } from "./WorkoutItem.tsx";

type StaticWorkoutSetDisplayProps = {
  set: Set;
  index: number;
};

export default function StaticWorkoutSetDisplay({
  set,
  index,
}: StaticWorkoutSetDisplayProps): React.JSX.Element {
  return (
    <div
      className="exercise-set-item"
      id={`static-exercise-set-item-${set.id}`}
    >
      <div className="set-button">
        <p>
          {set.type && set.type !== "1" ? (
            <Icon className="set-icon" name={set.type} />
          ) : (
            index + 1
          )}
        </p>
      </div>

      <div>
        {!set.type || set.type === "1" ? (
          <input
            type="text"
            value={set.rir <= 0 ? "" : set.rir}
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
          maxLength={5}
          disabled
        />
      </div>
    </div>
  );
}
