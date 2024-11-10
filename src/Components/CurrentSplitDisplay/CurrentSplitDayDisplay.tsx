import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";
import MiniWorkoutPreview from "../WorkoutPreview/MiniWorkoutPreview";
import { useMemo } from "react";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";

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
          <MiniWorkoutPreview
            footerProps={{
              "data-day": days[day],
            }}
            workout={props.workout}
            className={"workout " + props.status}
            day={days[day]}
          />

          {props.status === "skipped" && (
            <>
              <div
                className="badge"
                data-tooltip-id="skipped-tooltip"
                data-tooltip-place="bottom"
                data-tooltip-class-name="skipped-tooltip"
                data-tooltip-delay-show={150}
              >
                <Icon name="clock" />
              </div>

              <p className="accessibility-only" aria-hidden={false}>
                Looks like you missed a workout. Let’s aim to complete the next
                one. Consistency is key!
              </p>

              <Tooltip id="skipped-tooltip">
                <p>
                  Looks like you missed a workout. Let’s aim to complete the
                  next one. Consistency is key!
                </p>
              </Tooltip>
            </>
          )}

          {props.status === "done" && (
            <>
              <div className="badge">
                <Icon name="circle-check" />
              </div>

              <p className="accessibility-only" aria-hidden={false}>
                Workout complete! You're one step closer to your goals. Well
                done!
              </p>

              <Tooltip id="done-tooltip">
                <p>
                  Workout complete! You're one step closer to your goals. Well
                  done!
                </p>
              </Tooltip>
            </>
          )}

          <p className="accessibility-only" aria-hidden={false}>
            {days[day]}
          </p>
        </div>
      )}
    </>
  );
}
