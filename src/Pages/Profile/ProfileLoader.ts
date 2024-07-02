import { defer, redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default async function profileLoader() {
  if (!(await getJWT())) return redirect("/authentication");

  return defer({
    user: sendAPIRequest({
      endpoint: "/api/user/me/detailed",
      request: {
        method: "get",
      },
    }),
    workouts: sendAPIRequest({
      endpoint: "/api/workout/personal/simple",
      request: {
        method: "get",
      },
    }),
  });
}
