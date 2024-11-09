import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const userLoader = createLoader(({ params: { username } }) => {
  if (!username) return redirect("/me");

  return {
    user: sendAPIRequest("/api/user/{username}/detailed", {
      method: "get",
      parameters: {
        username,
      },
    }),
    latestWeekOfActivity: sendAPIRequest(
      "/api/user/{username}/streak/week/{date}",
      {
        method: "get",
        parameters: {
          date: (() => {
            const today = new Date();
            const formatted = `${today.getUTCFullYear()}-${
              today.getUTCMonth() + 1
            }-${today.getUTCDate()}`;
            return formatted;
          })(),
          username,
        },
      }
    ),
    pins: sendAPIRequest("/api/user/{username}/pins", {
      method: "get",
      parameters: {
        username,
      },
    }),
  };
}, "/:username");

export default userLoader;
