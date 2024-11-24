import "./WorkoutPreview.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import User from "../User/User";
import { Link } from "react-router-dom";
import { HTMLProps } from "../../Types/Utility/HTMLProps";

type WorkoutPreviewDisplayProps = {
  workout: Schema<"SimpleWorkoutResponseDTO">;
  headerProps?: HTMLProps<HTMLDivElement>;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footerProps?: HTMLProps<HTMLDivElement>;
} & HTMLProps<HTMLDivElement>;

export default function WorkoutPreview({
  workout,
  className,
  headerProps,
  bodyProps,
  footerProps,
  ...attr
}: WorkoutPreviewDisplayProps) {
  return (
    <div
      className={"workout-preview " + (className ? className : "")}
      {...attr}
    >
      <div className="workout-preview-header" {...headerProps}>
        <Link
          className="workout-preview-header-name"
          to={`/${workout.creator.username}/workout/${workout.name}`}
        >
          {workout.name}
        </Link>
      </div>

      <div className="workout-preview-body" {...bodyProps}>
        <p>
          {workout.description
            ? workout.description.length > 150
              ? workout.description.slice(0, 75) + "..."
              : workout.description
            : ""}
        </p>
      </div>

      <div className="workout-preview-footer" {...footerProps}>
        <User user={workout.creator} />
      </div>
    </div>
  );
}
