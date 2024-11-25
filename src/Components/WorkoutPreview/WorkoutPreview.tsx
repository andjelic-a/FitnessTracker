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
      <div className="workout-preview-body" {...headerProps}>
        <Link
          className="workout-preview-body-name"
          to={`/${workout.creator.username}/workout/${workout.name}`}
        >
          {workout.name}
        </Link>
      </div>

      <div className="workout-preview-footer" {...footerProps}>
        <User user={workout.creator} />
      </div>
    </div>
  );
}
