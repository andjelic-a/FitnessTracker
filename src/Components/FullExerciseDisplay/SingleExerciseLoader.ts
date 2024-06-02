import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import { getOne } from "../../Data/Get";
import { FullExercise } from "../../Types/Models/FullExercise";

interface SingleExerciseLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":exerciseId">>;
}

export default async function singleExerciseLoader({
  params: { exerciseId },
}: SingleExerciseLoaderArguments) {
  if (!exerciseId) throw new Error("No exerciseId provided");

  return defer({
    exercise: getOne<FullExercise>("FullExercise", exerciseId, "all"),
  });
}
