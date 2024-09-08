import "./CurrentSplitDisplay.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { v4 } from "uuid";
import { useEffect, useState } from "react";
import CurrentSplitDayDisplay from "./CurrentSplitDayDisplay";
import WorkoutCarousel from "../WorkoutCarousel/WorkoutCarousel";

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

//Done means that the user completed the workout
//Pending means that the user did not complete the workout YET (meaning tomorrows workouts will always be pending)
//Skipped means that the user skipped the workout (if they didn't go to the gym yesterday but they were supposed to).
//Pending-today means user still hasn't completed the workout but they still have time (until the end of the day before it's marked as skipped)
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

  useEffect(() => {
    const a = extractWorkouts(split);
    setWorkouts([...a.slice(1), a[0]]);
    // setWorkouts(a);
  }, [split]);

  function extractWorkouts(
    split: Schema<"DetailedUserSplitResponseDTO">
  ): SplitWorkout[] {
    const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];

    //TODO: Ask the user if they prefer to have this display as monday-first or sunday-first
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
    let today = new Date().getUTCDay();
    // if (today === -1) today = 6;

    if (workout.day > today) return "pending";

    if (latestActivity.completedWorkouts.includes(workout.day)) return "done";

    if (workout.day === today) return "pending-today";

    return "skipped";
  }

  function getStatusForRest(day: number): RestStatus {
    let today = new Date().getUTCDay();
    // if (today === -1) today = 6;

    if (day === today) return "scheduled-today";
    if (day < today) return "passed";
    return "scheduled";
  }

  return (
    <WorkoutCarousel className="current-split-workouts">
      {workouts.map((x, i) =>
        x.splitWorkout ? (
          <CurrentSplitDayDisplay
            type="workout"
            key={x.key}
            day={i}
            status={x.status}
            workout={x.splitWorkout as Schema<"SimpleWorkoutResponseDTO">}
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
    </WorkoutCarousel>
  );
}
