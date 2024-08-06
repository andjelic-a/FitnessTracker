import "./CurrentSplitDisplay.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { v4 } from "uuid";
import { useEffect, useRef, useState } from "react";
import CurrentSplitDayDisplay from "./CurrentSplitDayDisplay";

type CurrentSplitDisplayProps = {
  split: Schema<"DetailedUserSplitResponseDTO">;
  latestActivity: Schema<"DetailedWeekOfCompletedWorkoutsResponseDTO">;
};

type SplitWorkout = {
  key: string;
} & (
  | {
      splitWorkout: Schema<"SimpleSplitWorkoutResponseDTO">;
      status: WorkoutStatus;
    }
  | {
      splitWorkout: null;
      status: RestStatus;
    }
);

//Done means that the user done the workout
//Pending means that the user did not complete the workout YET (meaning tomorrows workouts will always be pending)
//Skipped means that the user skipped the workout (if they didn't go to the gym yesterday but they were supposed to).
//Pending-today not done yet but still has time (until the end of the day before it's marked as skipped)
export type WorkoutStatus = "done" | "skipped" | "pending" | "pending-today";

//Passed means that the rest day already passed
//Scheduled means that the rest day is scheduled (supposed to happen in future)
//Scheduled-today means that the rest day is scheduled for today (supposed to happen today)
export type RestStatus = "passed" | "scheduled" | "scheduled-today";

export default function CurrentSplitDisplay({
  split,
  latestActivity,
}: CurrentSplitDisplayProps) {
  const [workouts, setWorkouts] = useState<SplitWorkout[]>([]);
  const innerWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => void setWorkouts(extractWorkouts(split)), [split]);

  function extractWorkouts(
    split: Schema<"DetailedUserSplitResponseDTO">
  ): SplitWorkout[] {
    const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];

    for (let i = 0; i < 7; i++)
      workouts.push(split.workouts.find((x) => x.day === i) ?? null);

    return workouts.map((x, i) => ({
      key: v4(),
      splitWorkout: x,
      status: !x ? getStatusForRest(i) : getStatusForWorkout(x),
    })) as SplitWorkout[];
  }

  function getStatusForWorkout(
    workout: Schema<"SimpleSplitWorkoutResponseDTO">
  ): WorkoutStatus {
    if (workout.day > new Date().getUTCDay() - 1) return "pending";

    if (latestActivity.completedWorkouts.includes(workout.day)) return "done";

    if (workout.day === new Date().getUTCDay() - 1) return "pending-today";

    return "skipped";
  }

  function getStatusForRest(day: number): RestStatus {
    const today = new Date().getUTCDay() - 1;
    if (day === today) return "scheduled-today";
    if (day < today) return "passed";
    return "scheduled";
  }

  return (
    <div className="current-split-display-container">
      <div className="inner-container" ref={innerWrapperRef}>
        {workouts.map((x, i) =>
          x.splitWorkout ? (
            <CurrentSplitDayDisplay
              type="workout"
              key={x.key}
              day={x.splitWorkout.day}
              status={x.status}
              workout={x.splitWorkout}
            />
          ) : (
            <CurrentSplitDayDisplay
              type="rest"
              key={x.key}
              status={x.status}
              day={i}
            />
          )
        )}
      </div>
    </div>
  );
}