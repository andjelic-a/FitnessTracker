import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const profileFollowersContainerLoader = createLoader(({ request }) => {
  const searchParams = new URL(request.url).searchParams;

  return {
    type: "followers",
    followers: sendAPIRequest("/api/user/me/followers", {
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
        name: searchParams.get("search") ?? undefined,
      },
    }).then((x) => (x.code === "OK" ? x.content : [])),
  };
});

export default profileFollowersContainerLoader;
