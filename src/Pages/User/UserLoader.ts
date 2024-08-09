import { redirect } from "react-router-dom";
import sendAPIRequest from "../../Data/SendAPIRequest";
import createLoader from "../../BetterRouter/CreateLoader";

const userLoader = createLoader(({ params: { userId } }) => {
  if (!userId) return redirect("/me");

  return {
    user: sendAPIRequest("/api/user/{id}/detailed", {
      method: "get",
      parameters: {
        id: userId,
      },
    }),
    streak: sendAPIRequest("/api/user/{userId}/streak", {
      method: "get",
      parameters: {
        userId,
      },
    }),
  };
}, "/user/:userId");

export default userLoader;
