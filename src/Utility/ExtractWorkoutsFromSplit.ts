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
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const workouts: (Schema<"SimpleSplitWorkoutResponseDTO"> | null)[] = [];

  for (let i = 0; i < 7; i++)
    workouts.push(split.workouts.find((x) => x.day === i) ?? null);

  const mappedWorkouts = workouts.map((x, i) => ({
    day: days[i],
    workout: x,
  }));

  return mappedWorkouts;
}
