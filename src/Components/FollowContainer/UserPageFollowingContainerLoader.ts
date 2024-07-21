import { redirect } from "react-router-dom";
import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const userPageFollowingContainerLoader = createLoader(
  "/user/:userId/following",
  ({ params: { userId }, request }) => {
    if (!userId) return redirect("/");

    const searchParams = new URL(request.url).searchParams;

    return {
      type: "following",
      following: sendAPIRequest("/api/user/{id}/following", {
        method: "get",
        parameters: {
          id: userId,
          limit: 10,
          offset: 0,
          name: searchParams.get("search") ?? undefined,
        },
      }).then((x) => (x.code === "OK" ? x.content : [])),
    };
  }
);

export default userPageFollowingContainerLoader;
