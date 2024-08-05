import { useNavigate } from "react-router-dom";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";

type CurrentSplitDayDisplayProps = {
  day: number;
} & (
  | {
      type: "workout";
      workout: Schema<"SimpleWorkoutResponseDTO">;
      status: WorkoutStatus;
    }
  | {
      type: "rest";
      status: RestStatus;
    }
);

export default function CurrentSplitDayDisplay({
  day,
  ...props
}: CurrentSplitDayDisplayProps) {
  const navigate = useNavigate();

  return (
    <>
      {props.type === "rest" ? (
        <p className={"workout rest " + props.status}>Rest</p>
      ) : (
        <p
          className={"workout " + props.status}
          onClick={() => navigate(`workout/${props.workout.id}`)}
        >
          {props.workout.name}
        </p>
      )}
    </>
  );
}
