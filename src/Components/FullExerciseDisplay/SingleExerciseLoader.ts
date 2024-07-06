import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

interface SingleExerciseLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":exerciseId">>;
}

export default async function singleExerciseLoader({
  params: { exerciseId },
}: SingleExerciseLoaderArguments) {
  if (!exerciseId) throw new Error("No exerciseId provided");

  return defer({
    exercise: sendAPIRequest("/api/exercise/{id}/detailed", {
      method: "get",
      parameters: {
        id: parseInt(exerciseId),
      },
    }),
  });
}
