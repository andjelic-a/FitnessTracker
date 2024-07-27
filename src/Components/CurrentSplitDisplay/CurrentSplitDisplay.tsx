import { Schema } from "../../Types/Endpoints/SchemaParser";

type CurrentSplitDisplayProps = {
  split: Schema<"DetailedUserSplitResponseDTO">;
};

export default function CurrentSplitDisplay({
  split,
}: CurrentSplitDisplayProps) {
  function extractWorkouts(
    split: Schema<"DetailedUserSplitResponseDTO">
  ): (Schema<"SimpleWorkoutResponseDTO"> | null)[] {
    const workouts: (Schema<"SimpleWorkoutResponseDTO"> | null)[] = [];

    for (let i = 0; i < 7; i++)
      workouts.push(split.workouts.find((x) => x.day === i)?.workout ?? null);

    return workouts;
  }

  return (
    <div className="current-split-display-container">
      {extractWorkouts(split).map((x) => {
        if (!x) return <h1>Rest</h1>;

        return <h1>{x.name}</h1>;
      })}
    </div>
  );
}
