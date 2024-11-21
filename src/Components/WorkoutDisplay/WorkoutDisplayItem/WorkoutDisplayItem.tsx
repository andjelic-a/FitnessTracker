import "./WorkoutDisplayItem.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import WorkoutDisplaySet from "./WorkoutDisplaySet";
import { Link } from "react-router-dom";
import { useState } from "react";
import Icon from "../../Icon/Icon";

type WorkoutDisplayItemProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Schema<"DetailedSetResponseDTO">[];
  onOpenChartWindow: (exercise: Schema<"SimpleExerciseResponseDTO">) => void;
};

export default function WorkoutDisplayItem({
  sets,
  exercise,
  onOpenChartWindow,
}: WorkoutDisplayItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="workout-display-item">
      <div className="workout-display-item-header">
        <div className="image-container">
          <img src={exercise.image} />
        </div>

        <Link className="exercise-name" to={`/exercises/${exercise.id}`}>
          {exercise.name}
        </Link>

        <button
          className="collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Icon name={`chevron-${isCollapsed ? "up" : "down"}`} />

          <p className="accessibility-only" aria-hidden={false}>
            Collapse
          </p>
        </button>

        <button
          onClick={() => void onOpenChartWindow(exercise)}
          className="chart-link"
        >
          <Icon name="chart-line" />

          <p className="accessibility-only" aria-hidden={false}>
            Chart
          </p>
        </button>
      </div>

      <div
        className="workout-display-item-body"
        style={{
          display: isCollapsed ? "none" : "flex",
        }}
      >
        <div className="set-information-header-container set">
          <p>SET</p>
          <p>RiR</p>
          <p>VOLUME</p>
        </div>

        {sets.map((set, index) => (
          <WorkoutDisplaySet key={set.id} index={index} set={set} />
        ))}
      </div>
    </div>
  );
}
