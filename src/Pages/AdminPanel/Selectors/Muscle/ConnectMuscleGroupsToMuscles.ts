import { Schema } from "../../../../Types/Endpoints/SchemaParser";

export default function connectMuscleGroups(
  muscleGroups: Schema<"SimpleMuscleGroupResponseDTO">[],
  muscles: Schema<"SimpleMuscleResponseDTO">[]
): (Schema<"SimpleMuscleGroupResponseDTO"> & {
  muscles: Schema<"SimpleMuscleResponseDTO">[];
})[] {
  return muscleGroups.map((muscleGroup) => {
    return {
      id: muscleGroup.id,
      name: muscleGroup.name,
      muscles: muscles
        .filter((muscle) => muscle.muscleGroupId === muscleGroup.id)
        .map((muscle) => {
          return {
            id: muscle.id,
            name: muscle.name,
            muscleGroupId: muscle.muscleGroupId,
          };
        }),
    };
  });
}
