import { defer, redirect } from "react-router-dom";
import { getJWT } from "../../Data/User";
import sendAPIRequest from "../../Data/SendAPIRequest";

export default async function profileLoader() {
  if (!(await getJWT())) return redirect("/authentication");

  return defer({
    user: sendAPIRequest("/api/user/me/detailed", {
      method: "get",
    }),
    workouts: sendAPIRequest("/api/workout/personal/simple", {
      method: "get",
      parameters: {
        limit: -1,
      },
    }),
    streak: sendAPIRequest("/api/user/me/streak", {
      method: "get",
      parameters: {},
    }),
  });
}
