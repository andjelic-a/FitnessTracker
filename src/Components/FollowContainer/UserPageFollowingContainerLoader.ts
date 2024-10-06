import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const userPageFollowingContainerLoader = createLoader(
  ({ params: { username }, request }) => {
    if (!username) return redirect("/");

    const searchParams = new URL(request.url).searchParams;

    return {
      type: "following",
      following: sendAPIRequest("/api/user/{username}/following", {
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
  "/user/:username/following"
);

export default userPageFollowingContainerLoader;
