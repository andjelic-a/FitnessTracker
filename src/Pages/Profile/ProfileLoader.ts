import { defer, redirect } from "react-router-dom";
import { getBearerToken } from "../../Data/User";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default async function profileLoader() {
  if (!(await getBearerToken())) return redirect("/authentication");

  return defer({
    user: sendAPIRequest({
      endpoint: "/api/user/me/detailed",
      request: {
        method: "get",
      },
    }),
  });
}
