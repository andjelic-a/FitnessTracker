import "./WorkoutPreview.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import User from "../User/User";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  return (
    <div
      className={"workout-preview " + (className ? className : "")}
      {...attr}
    >
      <div className="header" {...headerProps}>
        <p className="name" onClick={() => navigate(`workout/${workout.id}`)}>
          {workout.name}
        </p>
      </div>

      <div className="body" {...bodyProps}>
        <p>
          {workout.description
            ? workout.description.length > 150
              ? workout.description.slice(0, 150) + "..."
              : workout.description
            : ""}
        </p>
      </div>

      <div className="footer" {...footerProps}>
        <User user={workout.creator} />
      </div>
    </div>
  );
}
