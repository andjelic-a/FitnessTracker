import { Immutable, Narrow } from "../Utility/Models";
import Muscle from "./Muscle";
import MuscleGroup from "./MuscleGroup";

export type FullMuscleGroup = Immutable<{
  id: number;
  name: string;
  muscles: Immutable<Narrow<Muscle, ["id", "name"]>>[];
}>;

export function connectMuscleGroups(
  muscleGroups: Immutable<Narrow<MuscleGroup, ["id", "name"]>>[],
  muscles: Immutable<Narrow<Muscle, ["id", "name", "muscleGroupId"]>>[]
): FullMuscleGroup[] {
  const fullMuscleGroups: FullMuscleGroup[] = [];
  muscleGroups.forEach((muscleGroup) => {
    fullMuscleGroups.push({
      id: muscleGroup.id,
      name: muscleGroup.name,
      muscles: muscles.filter(
        (muscle) => muscle.muscleGroupId === muscleGroup.id
      ),
    });
  });

  return fullMuscleGroups;
}
