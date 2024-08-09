import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";

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
  return (
    <>
      {props.type === "rest" ? (
        <div className={"workout rest " + props.status}>
          <p
            data-day={
              [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ][day]
            }
          >
            Rest
          </p>
        </div>
      ) : (
        <WorkoutPreview
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
