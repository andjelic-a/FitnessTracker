import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import { FullExercise } from "../../../../Types/Models/FullExercise";
import get, { getOne } from "../../../../Data/Get";
import MuscleGroup from "../../../../Types/Models/MuscleGroup";
import Muscle from "../../../../Types/Models/Muscle";
import Equipment from "../../../../Types/Models/Equipment";

interface UpdateExerciseLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":exerciseId">>;
}

export default async function updateExerciseLoader({
  params: { exerciseId },
}: UpdateExerciseLoaderArguments) {
  if (!exerciseId) throw new Error("No exerciseId provided");

  return defer({
    exercise: getOne<FullExercise>("FullExercise", exerciseId, "all"),
    muscleGroups: get<MuscleGroup>("MuscleGroup", "none", undefined, -1, 0),
    muscles: get<Muscle>("Muscle", "none", undefined, -1, 0),
    equipment: get<Equipment>("Equipment", "none", undefined, -1, 0),
  });
}
