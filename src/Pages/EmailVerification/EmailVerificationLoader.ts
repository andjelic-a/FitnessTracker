import {
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  defer,
} from "react-router-dom";
import { baseAPIUrl } from "../../Data/BaseURLs";
import { getJWT } from "../../Data/User";

interface emailVerificationLoaderArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<":code">>;
}

export default async function emailVerificationLoader({
  params: { code },
}: emailVerificationLoaderArgs) {
  return defer({
    message: fetch(`${baseAPIUrl}/user/confirm/${code}`, {
      method: "POST",
      headers: {
        Authorization: (await getJWT()) as string,
      },
    }).then((response) => response.ok),
  });
}
