import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";

interface emailVerificationLoaderArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":code">>;
}

export default async function emailVerificationLoader({
  params: { code },
}: emailVerificationLoaderArgs) {
  return defer({
    response: sendAPIRequest("/api/user/me/confirmemail/{code}", {
      method: "patch",
      parameters: {
        code: code ?? "",
      },
    }),
  });
}
