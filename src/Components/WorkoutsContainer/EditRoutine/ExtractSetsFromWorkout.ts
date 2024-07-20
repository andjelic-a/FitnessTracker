import { v4 } from "uuid";
import { Schema } from "../../../Types/Endpoints/SchemaParser";
import {
  PossibleSetIcon,
  RoutineItemData,
} from "../CreateRoutine/RoutineItem/RoutineItem";

export default function extractSets(
  originalWorkout: Schema<"DetailedWorkoutResponseDTO">
) {
  const sets: RoutineItemData[] = [];

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
      isDropdownOpen: false,
      repRange: `${set.bottomRepRange}-${set.topRepRange}`,
      rir: set.riR,
      selectedIcon: [null, "w", "d", "f"][set.type] as PossibleSetIcon,
      idx: 1,
    });

    const firstIdx = i;

    while (
      i + 1 < originalWorkout.sets.length &&
      originalWorkout.sets[i + 1].exerciseId === currentExercise.id
    ) {
      i++;
      const set = originalWorkout.sets[i];

      sets[sets.length - 1].sets.push({
        id: set.id,
        isDropdownOpen: false,
        repRange: `${set.bottomRepRange}-${set.topRepRange}`,
        rir: set.riR,
        selectedIcon: [null, "w", "d", "f"][set.type] as PossibleSetIcon,
        idx: i - firstIdx + 1,
      });
    }
  }

  return sets;
}
