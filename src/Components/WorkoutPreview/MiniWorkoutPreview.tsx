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
  day?: string;
} & HTMLProps<HTMLDivElement>;

export default function MiniWorkoutPreview({
  workout,
  className,
  headerProps,
  bodyProps,
  footerProps,
  day,
  ...attr
}: WorkoutPreviewDisplayProps) {
  return (
    <div
      className={"mini-workout-preview " + (className ? className : "")}
      {...attr}
    >
      <div className="mini-workout-preview-header" {...headerProps}>
        <Link
          className="mini-workout-preview-header-name"
          to={`/${workout.creator.username}/workout/${workout.name}`}
        >
          {workout.name}
        </Link>

        <p className="mini-workout-preview-header-day">{day}</p>
      </div>

      <div className="mini-workout-preview-footer" {...footerProps}>
        <User user={workout.creator} />
      </div>
    </div>
  );
}
