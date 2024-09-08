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
    streak: sendAPIRequest("/api/user/{username}/streak", {
      method: "get",
      parameters: {
        username,
      },
    }),
  };
}, "/user/:username");

export default userLoader;
