import {
  defer,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  redirect,
} from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

interface UserLoaderArguments extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":userId">>;
}

export default async function userLoader({
  params: { userId },
}: UserLoaderArguments) {
  if (!userId) return redirect("/me");

  return defer({
    user: sendAPIRequest("/api/user/{id}/detailed", {
      method: "get",
      parameters: {
        id: userId,
      },
    }),
  });
}
