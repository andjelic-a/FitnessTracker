import {
  defer,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  redirect,
} from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

interface RoutineDisplayLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":id">>;
}

export default async function routineDisplayLoader({
  params: { id },
}: RoutineDisplayLoaderArguments) {
  if (!id) return redirect("/me");

  return defer({
    routine: sendAPIRequest("/api/workout/{id}/detailed", {
      method: "get",
      parameters: {
        id,
      },
    }),
  });
}
