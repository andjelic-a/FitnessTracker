import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const userPageFollowersContainerLoader = createLoader(
  ({ params: { userId }, request }) => {
    if (!userId) return redirect("/");

    const searchParams = new URL(request.url).searchParams;

    return {
      type: "followers",
      followers: sendAPIRequest("/api/user/{id}/followers", {
        method: "get",
        parameters: {
          id: userId,
          limit: 10,
          offset: 0,
          name: searchParams.get("search") ?? undefined,
        },
      }).then((x) => (x.code === "OK" ? x.content : [])),
    };
  },
  "/user/:userId/followers"
);

export default userPageFollowersContainerLoader;
