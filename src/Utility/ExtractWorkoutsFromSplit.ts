import { Schema } from "../Types/Endpoints/SchemaParser";
import { Day } from "../Types/Utility/Day";

type SplitWorkout = {
  workout: Schema<"SimpleSplitWorkoutResponseDTO"> | null;
  day: Day;
};

export default function extractWorkoutsFromSplit(
  split: Schema<"DetailedSplitResponseDTO">
): SplitWorkout[] {
  const days: Day[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];

  for (let i = 0; i < 7; i++)
    workouts.push(split.workouts.find((x) => x.day === i) ?? null);

  const mappedWorkouts = [...workouts.slice(1), workouts[0]].map((x, i) => ({
    day: days[i],
    workout: x,
  }));

  return mappedWorkouts;
}
