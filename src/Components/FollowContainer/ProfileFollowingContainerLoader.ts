import createLoader from "../../BetterRouter/CreateLoader";
import sendAPIRequest from "../../Data/SendAPIRequest";

const profileFollowingContainerLoader = createLoader(({ request }) => {
  const searchParams = new URL(request.url).searchParams;

  return {
    type: "following",
    following: sendAPIRequest("/api/user/me/following", {
      method: "get",
      parameters: {
        limit: 10,
        offset: 0,
        name: searchParams.get("search") ?? undefined,
      },
    }).then((x) => (x.code === "OK" ? x.content : [])),
  };
});

export default profileFollowingContainerLoader;
