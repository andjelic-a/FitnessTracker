import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";
import WorkoutPreview from "../WorkoutPreview/WorkoutPreview";
import { useMemo } from "react";
import Icon from "../Icon/Icon";

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
  const days = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    []
  );

  return (
    <>
      {props.type === "rest" ? (
        <div className={"workout rest " + props.status}>
          <p data-day={days[day]}>Rest</p>

          <p className="accessibility-only" aria-hidden={false}>
            {days[day]}
          </p>
        </div>
      ) : (
        <div className="workout-container">
          <WorkoutPreview
            footerProps={{
              "data-day": days[day],
            }}
            workout={props.workout}
            className={"workout " + props.status}
          />

          {props.status === "skipped" && (
            <div className="badge">
              <Icon name="clock" />
            </div>
          )}

          {props.status === "done" && (
            <div className="badge">
              <Icon name="trophy" />
            </div>
          )}

          <p className="accessibility-only" aria-hidden={false}>
            {days[day]}
          </p>
        </div>
      )}
    </>
  );
}
