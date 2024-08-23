import { v4 } from "uuid";
import {
  SetType,
  WorkoutItemData,
} from "../Components/WorkoutSetCreator/WorkoutItem/WorkoutItem";
import { Schema } from "../Types/Endpoints/SchemaParser";

export default function extractSets(
  originalWorkout: Schema<"DetailedWorkoutResponseDTO">
): WorkoutItemData[] {
  const sets: WorkoutItemData[] = [];

  let currentExercise: Schema<"SimpleExerciseResponseDTO"> | undefined =
    undefined;

  for (let i = 0; i < originalWorkout.sets.length; i++) {
    const set = originalWorkout.sets[i];
    currentExercise = originalWorkout.exercises.find(
      (x) => x.id === set.exerciseId
    );

    if (!currentExercise) continue;

    sets.push({
      id: v4(),
      exercise: currentExercise,
      sets: [],
    });

    sets[sets.length - 1].sets.push({
      id: set.id,
      repRange: `${set.bottomRepRange}-${set.topRepRange}`,
      rir: set.riR,
      type: ["1", "w", "d", "f"][set.type] as SetType,
    });

    while (
      i + 1 < originalWorkout.sets.length &&
      originalWorkout.sets[i + 1].exerciseId === currentExercise.id
    ) {
      i++;
      const set = originalWorkout.sets[i];

      sets[sets.length - 1].sets.push({
        id: set.id,
        repRange: `${set.bottomRepRange}-${set.topRepRange}`,
        rir: set.riR,
        type: [null, "w", "d", "f"][set.type] as SetType,
      });
    }
  }

  return sets;
}

export function extractSetsNoMapping(
  originalWorkout: Schema<"DetailedWorkoutResponseDTO">
) {
  const sets: {
    id: string;
    exercise: Schema<"SimpleExerciseResponseDTO">;
    sets: Schema<"DetailedSetResponseDTO">[];
  }[] = [];

  let currentExercise: Schema<"SimpleExerciseResponseDTO"> | undefined =
    undefined;

  for (let i = 0; i < originalWorkout.sets.length; i++) {
    const set = originalWorkout.sets[i];
    currentExercise = originalWorkout.exercises.find(
      (x) => x.id === set.exerciseId
    );

    if (!currentExercise) continue;

    sets.push({
      id: v4(),
      exercise: currentExercise,
      sets: [set],
    });

    while (
      i + 1 < originalWorkout.sets.length &&
      originalWorkout.sets[i + 1].exerciseId === currentExercise.id
    ) {
      i++;
      const set = originalWorkout.sets[i];

      sets[sets.length - 1].sets.push(set);
    }
  }

  return sets;
}
