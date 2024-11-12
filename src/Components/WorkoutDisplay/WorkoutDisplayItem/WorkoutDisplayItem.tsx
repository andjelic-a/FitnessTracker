import "./WorkoutDisplayItem.scss";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import WorkoutDisplaySet from "./WorkoutDisplaySet";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import Icon from "../../Icon/Icon";

type WorkoutDisplayItemProps = {
  exercise: Schema<"SimpleExerciseResponseDTO">;
  sets: Schema<"DetailedSetResponseDTO">[];
};

export default function WorkoutDisplayItem({
  sets,
  exercise,
}: WorkoutDisplayItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bodyPortalNode = useMemo(
    () =>
      createHtmlPortalNode({
        attributes: {
          class: "workout-display-item-body",
        },
      }),
    []
  );

  return (
    <div className="workout-display-item">
      <InPortal node={bodyPortalNode}>
        <div className="set-information-header-container set">
          <p>SET</p>
          <p>RiR</p>
          <p>VOLUME</p>
        </div>

        {sets.map((set, index) => (
          <WorkoutDisplaySet key={set.id} index={index} set={set} />
        ))}
      </InPortal>

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

        <Link to={`${exercise.id}/chart`} className="chart-link">
          <Icon name="chart-line" />

          <p className="accessibility-only" aria-hidden={false}>
            Chart
          </p>
        </Link>
      </div>

      {!isCollapsed && <OutPortal node={bodyPortalNode} />}
    </div>
  );
}
