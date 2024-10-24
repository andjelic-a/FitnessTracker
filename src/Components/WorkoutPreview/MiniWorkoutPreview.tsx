import "./WorkoutPreview.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import Icon from "../Icon/Icon";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
import { HTMLProps } from "../../Types/Utility/HTMLProps";

type WorkoutPreviewDisplayProps = {
  workout: Schema<"SimpleWorkoutResponseDTO">;
  headerProps?: HTMLProps<HTMLDivElement>;
  bodyProps?: HTMLProps<HTMLDivElement>;
  footerProps?: HTMLProps<HTMLDivElement>;
} & HTMLProps<HTMLDivElement>;

export default function MiniWorkoutPreview({
  workout,
  className,
  headerProps,
  bodyProps,
  footerProps,
  ...attr
}: WorkoutPreviewDisplayProps) {
  const navigate = useNavigate();

  return (
    <div
      className={"mini-workout-preview " + (className ? className : "")}
      {...attr}
    >
      <div className="mini-workout-preview-header" {...headerProps}>
        <p
          className="mini-workout-preview-header-name"
          onClick={() => navigate(`workout/${workout.id}`)}
        >
          {workout.name}
        </p>
        {!workout.isPublic && (
          <p className="private-label">
            <Icon name="lock" />
          </p>
        )}
      </div>

      <div className="mini-workout-preview-footer" {...footerProps}>
        <User user={workout.creator} />
      </div>
    </div>
  );
}
