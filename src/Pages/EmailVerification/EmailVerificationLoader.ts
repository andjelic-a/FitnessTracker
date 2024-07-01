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
    response: sendAPIRequest({
      endpoint: "/api/user/me/confirmemail/{code}",
      request: {
        method: "patch",
        parameters: {
          code: code ?? "",
        },
      },
    }),
  });
}
