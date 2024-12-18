import { Schema } from "../../Types/Endpoints/SchemaParser";
import { RestStatus, WorkoutStatus } from "./CurrentSplitDisplay";
import MiniPreview from "../MiniPreview/MiniPreview";
import { useMemo } from "react";
import Icon from "../Icon/Icon";
import { Tooltip } from "react-tooltip";
import { Link } from "react-router-dom";

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
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
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
          <MiniPreview
            footerProps={{
              "data-day": days[day],
            }}
            data={props.workout}
            type="workout"
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
              <div
                className="badge"
                data-tooltip-id="done-tooltip"
                data-tooltip-place="bottom"
                data-tooltip-class-name="done-tooltip"
                data-tooltip-delay-show={150}
              >
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

          {props.status === "pending-today" && (
            <>
              <Link
                to="/started-workout"
                className="badge pending-today-badge"
                data-tooltip-id="pending-today-tooltip"
                data-tooltip-place="bottom"
                data-tooltip-class-name="pending-today-tooltip"
                data-tooltip-delay-show={150}
              >
                <Icon name="circle" />
              </Link>

              <p className="accessibility-only" aria-hidden={false}>
                Click to start today's workout
              </p>

              <Tooltip id="pending-today-tooltip">
                <p>Click to start today's workout</p>
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
