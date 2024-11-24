import { Link } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";

type ExerciseOptionProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  onSelectExercise: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
  isSelected: boolean;
};

export function ExerciseSelectorOption({
  exercise,
  onSelectExercise,
  isSelected,
}: ExerciseOptionProps) {
  return (
    <button
      role="option"
      aria-selected={isSelected}
      className={"exercise-option " + (isSelected ? "selected" : "")}
      onClick={() => void onSelectExercise(exercise)}
    >
      <div className="selection-indicator">
        <div className="circle">
          {isSelected && <Icon className="selected-mark" name="check" />}
        </div>
      </div>

      <div className="image-container">
        <img src={exercise.image} alt="Exercise" />
      </div>

      <h3 className="exercise-name">{exercise.name}</h3>

      <Link
        to={`/exercises/${exercise.id}`}
        target="_blank"
        className="view-details-link"
        data-tooltip-id={`link-tooltip-${exercise.id}`}
        onClick={(e) => void e.stopPropagation()}
      >
        <Icon name="link" />

        <Tooltip
          id={`link-tooltip-${exercise.id}`}
          place="top"
          content="View details"
          delayShow={150}
        />
      </Link>
    </button>
  );
}
