import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const userPageFollowersContainerLoader = createLoader(
  ({ params: { username }, request }) => {
    if (!username) return redirect("/");

    const searchParams = new URL(request.url).searchParams;

    return {
      type: "followers",
      followers: sendAPIRequest("/api/user/{username}/followers", {
        method: "get",
        parameters: {
          username,
          limit: 10,
          offset: 0,
          name: searchParams.get("search") ?? undefined,
        },
      }).then((x) => (x.code === "OK" ? x.content : [])),
    };
  },
  "/user/:username/followers"
);

export default userPageFollowersContainerLoader;
