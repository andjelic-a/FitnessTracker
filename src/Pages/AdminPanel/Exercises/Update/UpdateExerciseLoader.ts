import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import sendAPIRequest from "../../../../Data/SendAPIRequest";

interface UpdateExerciseLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":exerciseId">>;
}

export default async function updateExerciseLoader({
  params: { exerciseId },
}: UpdateExerciseLoaderArguments) {
  if (!exerciseId) throw new Error("No exerciseId provided");

  return defer({
    exercise: sendAPIRequest({
      endpoint: "/api/exercise/{id}/detailed",
      request: {
        method: "get",
        parameters: {
          id: parseInt(exerciseId),
        },
      },
    }),
    muscleGroups: sendAPIRequest({
      endpoint: "/api/musclegroup/detailed",
      request: {
        method: "get",
        parameters: {
          limit: -1,
        },
      },
    }),
    equipment: sendAPIRequest({
      endpoint: "/api/equipment",
      request: {
        method: "get",
        parameters: {
          limit: -1,
        },
      },
    }),
  });
}
