import "./WorkoutPreviewDisplay.scss";
import { DetailedHTMLProps, HtmlHTMLAttributes } from "react";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import User from "../User/User";
import { useNavigate } from "react-router-dom";

type WorkoutPreviewDisplayProps = {
  workout: Schema<"SimpleSplitWorkoutResponseDTO">;
} & DetailedHTMLProps<HtmlHTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export default function WorkoutPreviewDisplay({
  workout,
  className,
  ...attr
}: WorkoutPreviewDisplayProps) {
  const navigate = useNavigate();

  return (
    <div className={"workout-preview-display " + className} {...attr}>
      <div className="header">
        <p className="name" onClick={() => navigate(`workout/${workout.id}`)}>
          {workout.name}
        </p>
        {!workout.isPublic && <p className="private-label">Private</p>}
      </div>
      <div className="body">
        <p>
          {workout.description
            ? workout.description.length > 150
              ? workout.description.slice(0, 150) + "..."
              : workout.description
            : ""}
        </p>
      </div>
      <div className="footer">
        <User user={workout.creator} />
      </div>
    </div>
  );
}