import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";

type WorkoutSelectorOptionProps = {
  workout: Schema<"SimpleWorkoutOptionResponseDTO">;
  isSelected: boolean;
  onSelectWorkout: (workout: Schema<"SimpleWorkoutOptionResponseDTO">) => void;
};

export default function WorkoutSelectorOption({
  workout,
  isSelected,
  onSelectWorkout,
}: WorkoutSelectorOptionProps) {
  return (
    <button
      role="option"
      aria-selected={isSelected}
      className={"workout-option " + (isSelected ? "selected" : "")}
      onClick={() => void onSelectWorkout(workout)}
    >
      <div className="selection-indicator">
        <div className="circle">
          {isSelected && <Icon className="selected-mark" name="check" />}
        </div>
      </div>

      <div className="info-container">
        <h3 className="workout-name">{workout.name}</h3>
        <div>
          <p className="workout-description">
            {workout.description.length > 73
              ? workout.description.substring(0, 70) + "..."
              : workout.description}
          </p>
        </div>
      </div>

      <Link
        to={`/workouts/${workout.id}`}
        target="_blank"
        className="view-details-link"
        data-tooltip-id={`link-tooltip-${workout.id}`}
      >
        <Icon name="link" />

        <Tooltip
          id={`link-tooltip-${workout.id}`}
          place="top"
          content="View details"
          delayShow={150}
        />
      </Link>
    </button>
  );
}
