import "./CurrentSplitDisplay.scss";
import { Schema } from "../../Types/Endpoints/SchemaParser";
import { v4 } from "uuid";
import { useEffect, useState } from "react";

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
    }
);

//Completed means that the user completed the workout
//Not-completed means that the user did not complete the workout YET (meaning tomorrows workouts will always be not-completed)
//Skipped means that the user skipped the workout (if they didn't go to the gym yesterday but they were supposed to).
//Today not completed yet but still has time (until the end of the day before it's marked as skipped)
type WorkoutStatus = "completed" | "not-completed" | "skipped" | "today";

export default function CurrentSplitDisplay({
  split,
  latestActivity,
}: CurrentSplitDisplayProps) {
  const [workouts, setWorkouts] = useState<SplitWorkout[]>([]);

  useEffect(() => void setWorkouts(extractWorkouts(split)), [split]);

  function extractWorkouts(
    split: Schema<"DetailedUserSplitResponseDTO">
  ): SplitWorkout[] {
    const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];

    for (let i = 0; i < 7; i++)
      workouts.push(split.workouts.find((x) => x.day === i) ?? null);

    return workouts.map((x) => ({
      key: v4(),
      splitWorkout: x,
      status: !x ? "completed" : getStatusForWorkout(x),
    }));
  }

  function getStatusForWorkout(
    workout: Schema<"SimpleSplitWorkoutResponseDTO">
  ): WorkoutStatus {
    if (workout.day > new Date().getUTCDay() - 1) return "not-completed";

    if (latestActivity.completedWorkouts.includes(workout.day))
      return "completed";

    if (workout.day === new Date().getUTCDay() - 1) return "today";

    return "skipped";
  }

  return (
    <div className="current-split-display-container">
      {workouts.map((x) => {
        if (!x.splitWorkout) return <p key={x.key}>Rest</p>;

        return (
          <p key={x.key} className={"workout " + x.status}>
            {x.splitWorkout.workout.name}
          </p>
        );
      })}
    </div>
  );
}
