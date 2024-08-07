import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";
import WorkoutPreviewDisplay from "../WorkoutPreviewDisplay/WorkoutPreviewDisplay";

type CurrentSplitDayDisplayProps = {
  day: number;
} & (
  | {
      type: "workout";
      workout: Schema<"SimpleSplitWorkoutResponseDTO">;
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
  return (
    <>
      {props.type === "rest" ? (
        <div className={"workout rest " + props.status}>
          <p>Rest</p>
        </div>
      ) : (
        <WorkoutPreviewDisplay
          footerProps={{
            "data-day": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ][day],
          }}
          workout={props.workout}
          className={"workout " + props.status}
        />
      )}
    </>
  );
}
