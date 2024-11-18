import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";

type WorkoutSelectorOptionProps = {
  workout: Schema<"SimpleWorkoutOptionResponseDTO"> | null;
  isSelected: boolean;
  onSelectWorkout: (
    workout: Schema<"SimpleWorkoutOptionResponseDTO"> | null
  ) => void;
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
        <h3 className="workout-name">{workout?.name ?? "Rest"}</h3>
        <div>
          <p className="workout-description">{workout?.description}</p>
        </div>
      </div>

      {workout && (
        <Link
          to={`/${workout.creator.username}/workout/${workout.name}`}
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
      )}
    </button>
  );
}
